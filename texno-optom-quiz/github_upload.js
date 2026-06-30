const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.argv[2];
const OWNER = 'abdulazizsirojkurs-spec';
const REPO = 'charakter_quiz';
const BRANCH = 'main';

if (!TOKEN) {
  console.log('❌ Token kerak! Masalan: node github_upload.js ghp_xxxxx');
  process.exit(1);
}

// GitHub API ga so'rov yuborish
function githubAPI(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${OWNER}/${REPO}${endpoint}`,
      method: method,
      headers: {
        'User-Agent': 'texno-optom-uploader',
        'Authorization': `token ${TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      }
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);
    
    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d || '{}') });
        } catch(e) {
          resolve({ status: res.statusCode, data: d });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// Papkadagi barcha fayllarni topish
function getAllFiles(dir, base = '') {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    // Keraksiz papkalarni o'tkazib yuboramiz
    if (['node_modules', '.next', '.git', 'temp_excel', '.DS_Store'].includes(item)) continue;
    if (item.endsWith('.xlsx') || item.endsWith('.csv') || item.endsWith('.docx')) continue;
    if (item === 'test.png' || item === 'temp_site.html') continue;
    
    const fullPath = path.join(dir, item);
    const relPath = base ? `${base}/${item}` : item;
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else if (stat.size < 50 * 1024 * 1024) { // 50MB dan kichik fayllar
      results.push({ path: relPath, fullPath: fullPath });
    }
  }
  return results;
}

async function deleteExistingRepo() {
  console.log('🗑️  Eski fayllarni tozalash...');
  // Get the default branch ref
  const ref = await githubAPI('GET', '/git/ref/heads/main');
  if (ref.status === 200) {
    // Delete the branch to start fresh
    await githubAPI('DELETE', '/git/ref/heads/main');
  }
}

async function uploadFiles() {
  console.log('');
  console.log('🔍 Token tekshirilmoqda...');
  
  // Token tekshirish
  const user = await githubAPI('GET', '');
  if (user.status === 404 || user.status === 401 || user.status === 403) {
    console.log('❌ Token noto\'g\'ri yoki ruxsat yo\'q!');
    console.log('   Status:', user.status);
    console.log('   Xabar:', JSON.stringify(user.data).substring(0, 200));
    process.exit(1);
  }
  console.log('✅ Token ishlaydi! Repo:', user.data.full_name || REPO);
  
  // Fayllarni yig'ish
  const projectDir = path.join(__dirname);
  const files = getAllFiles(projectDir);
  console.log(`📁 ${files.length} ta fayl topildi`);
  
  // Git tree yaratish uchun blob'lar
  console.log('📦 Fayllar tayyorlanmoqda...');
  const treeItems = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const content = fs.readFileSync(file.fullPath);
    const base64 = content.toString('base64');
    
    process.stdout.write(`\r   ${i+1}/${files.length}: ${file.path.substring(0, 50)}...`);
    
    // Blob yaratish
    const blob = await githubAPI('POST', '/git/blobs', {
      content: base64,
      encoding: 'base64'
    });
    
    if (blob.status !== 201) {
      console.log(`\n❌ Fayl yuklanmadi: ${file.path} (${blob.status})`);
      console.log(JSON.stringify(blob.data).substring(0, 200));
      continue;
    }
    
    treeItems.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blob.data.sha
    });
  }
  
  console.log(`\n✅ ${treeItems.length} ta fayl tayyorlandi`);
  
  // Git tree yaratish
  console.log('🌳 Git tree yaratilmoqda...');
  const tree = await githubAPI('POST', '/git/trees', {
    tree: treeItems
  });
  
  if (tree.status !== 201) {
    console.log('❌ Tree yaratilmadi:', JSON.stringify(tree.data).substring(0, 200));
    process.exit(1);
  }
  
  // Commit yaratish
  console.log('💾 Commit yaratilmoqda...');
  const commit = await githubAPI('POST', '/git/commits', {
    message: '📦 Texno Optom PC Configurator - barcha fayllar va papkalar',
    tree: tree.data.sha,
    parents: []
  });
  
  if (commit.status !== 201) {
    console.log('❌ Commit yaratilmadi:', JSON.stringify(commit.data).substring(0, 200));
    process.exit(1);
  }
  
  // Main branch'ni yangilash yoki yaratish
  console.log('🔄 Main branch yangilanmoqda...');
  
  // Avval mavjud ref'ni yangilashga harakat qilamiz
  let result = await githubAPI('PATCH', '/git/refs/heads/main', {
    sha: commit.data.sha,
    force: true
  });
  
  // Agar ref topilmasa, yangisini yaratamiz
  if (result.status === 422 || result.status === 404) {
    result = await githubAPI('POST', '/git/refs', {
      ref: 'refs/heads/main',
      sha: commit.data.sha
    });
  }
  
  if (result.status === 200 || result.status === 201) {
    console.log('');
    console.log('==============================================');
    console.log('  ✅ MUVAFFAQIYATLI YUKLANDI!');
    console.log('==============================================');
    console.log('');
    console.log(`  GitHub: https://github.com/${OWNER}/${REPO}`);
    console.log('  Endi Vercel.com da Deploy qiling!');
  } else {
    console.log('❌ Branch yangilanmadi:', result.status, JSON.stringify(result.data).substring(0, 200));
  }
}

uploadFiles().catch(err => {
  console.log('❌ Xatolik:', err.message);
});
