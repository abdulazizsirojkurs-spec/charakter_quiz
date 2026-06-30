// app.js

const steps = [
    { id: 'cpu', title: '1. Protsessor (CPU)', icon: 'cpu' },
    { id: 'motherboard', title: '2. Ona plata (Motherboard)', icon: 'trello' },
    { id: 'ram', title: '3. Tezkor xotira (RAM)', icon: 'layers' },
    { id: 'gpu', title: '4. Videokarta (GPU)', icon: 'monitor' },
    { id: 'storage', title: '5. Doimiy xotira (Storage)', icon: 'hard-drive' },
    { id: 'case', title: '6. Keys (Case)', icon: 'box' },
    { id: 'psu', title: '7. Blok Pitaniya (PSU)', icon: 'zap' },
    { id: 'cooler', title: '8. Kuler (Cooler)', icon: 'wind' }
];

let selections = {
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    storage: null,
    case: null,
    psu: null,
    cooler: null
};

// Check Compatibility
function isCompatible(type, item) {
    // 1. Motherboard compatibility (depends on CPU)
    if (type === 'motherboard' && selections.cpu) {
        if (item.socket !== selections.cpu.socket) return false;
    }
    
    // 2. CPU compatibility (depends on Motherboard if selected first)
    if (type === 'cpu' && selections.motherboard) {
        if (item.socket !== selections.motherboard.socket) return false;
    }

    // 3. RAM compatibility (depends on Motherboard)
    if (type === 'ram' && selections.motherboard) {
        if (!selections.motherboard.ram_type.includes(item.type)) return false;
    }

    // 4. Case compatibility (depends on Motherboard form factor)
    if (type === 'case' && selections.motherboard) {
        if (!item.form_factors.includes(selections.motherboard.form_factor)) return false;
    }

    // 5. PSU compatibility (depends on GPU)
    if (type === 'psu' && selections.gpu) {
        if (item.wattage < selections.gpu.recommended_psu) return false;
    }

    // 6. Cooler compatibility (depends on CPU socket)
    if (type === 'cooler' && selections.cpu) {
        if (!item.sockets.includes(selections.cpu.socket)) return false;
    }

    return true;
}

// Render Steps
function renderSteps() {
    const container = document.getElementById('steps-container');
    container.innerHTML = '';

    steps.forEach(step => {
        const stepCard = document.createElement('div');
        stepCard.className = `step-card ${selections[step.id] ? 'completed' : ''}`;
        
        const isStepDisabled = false; // Logic to lock future steps can be added here if needed

        stepCard.innerHTML = `
            <div class="step-header">
                <div class="step-title">
                    <i data-feather="${step.icon}"></i> ${step.title}
                </div>
                <div class="step-status">
                    ${selections[step.id] ? '<i data-feather="check-circle" style="color: var(--accent)"></i> Tanlandi' : 'Tanlang'}
                </div>
            </div>
            <div class="component-list" id="list-${step.id}">
                <!-- Items injected here -->
            </div>
        `;
        container.appendChild(stepCard);

        const listContainer = document.getElementById(`list-${step.id}`);
        
        components[step.id].forEach(item => {
            const compatible = isCompatible(step.id, item);
            const selected = selections[step.id]?.id === item.id;
            
            const itemEl = document.createElement('div');
            itemEl.className = `component-item ${selected ? 'selected' : ''} ${!compatible ? 'disabled' : ''}`;
            
            // Build sub-info string
            let meta = [];
            if(item.socket) meta.push(`Socket: ${item.socket}`);
            if(item.type) meta.push(item.type);
            if(item.capacity) meta.push(item.capacity);
            if(item.form_factor) meta.push(item.form_factor);
            if(item.wattage) meta.push(`${item.wattage}W`);
            
            itemEl.innerHTML = `
                <div>
                    <div class="component-name">${item.name} ${!compatible ? '<span class="incompatible-badge">Mos emas</span>' : ''}</div>
                    <div class="component-meta">${meta.join(' | ')}</div>
                </div>
                <div>
                    ${selected ? '<i data-feather="check"></i>' : ''}
                </div>
            `;

            if (compatible) {
                itemEl.addEventListener('click', () => {
                    // Deselect if already selected
                    if (selected) {
                        selections[step.id] = null;
                        // Auto-remove dependent items if parent changes
                        if(step.id === 'cpu') {
                            if(selections.motherboard && selections.motherboard.socket !== item.socket) selections.motherboard = null;
                            if(selections.cooler && !selections.cooler.sockets.includes(item.socket)) selections.cooler = null;
                        }
                        if(step.id === 'motherboard') selections.ram = null;
                    } else {
                        selections[step.id] = item;
                    }
                    updateUI();
                });
            } else {
                itemEl.title = "Ushbu detal siz tanlagan boshqa detallarga mos kelmaydi!";
            }

            listContainer.appendChild(itemEl);
        });
    });
    
    // Re-initialize icons
    if(window.feather) {
        feather.replace();
    }
}

// Update Summary Sidebar
function updateSummary() {
    let totalBasePrice = 0;
    let itemsCount = 0;

    steps.forEach(step => {
        const summaryEl = document.getElementById(`summary-${step.id}`);
        const selectedItem = selections[step.id];
        
        if (selectedItem) {
            summaryEl.textContent = selectedItem.name;
            summaryEl.style.color = 'var(--text-main)';
            totalBasePrice += selectedItem.price;
            itemsCount++;
        } else {
            summaryEl.textContent = 'Tanlanmagan';
            summaryEl.style.color = 'var(--text-muted)';
        }
    });

    // Calculate Margin
    let finalPrice = 0;
    if (itemsCount > 0) {
        if (marginSetting.type === 'percentage') {
            finalPrice = totalBasePrice + (totalBasePrice * (marginSetting.value / 100));
        } else {
            finalPrice = totalBasePrice + marginSetting.value;
        }
    }

    // Display Total (Rounded to nearest integer)
    document.getElementById('total-price').textContent = itemsCount > 0 ? `$${Math.round(finalPrice)}` : '$0';
}

function updateUI() {
    renderSteps();
    updateSummary();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    document.getElementById('btn-reset').addEventListener('click', () => {
        selections = { cpu: null, motherboard: null, ram: null, gpu: null, storage: null, case: null, psu: null, cooler: null };
        updateUI();
    });

    document.getElementById('btn-checkout').addEventListener('click', () => {
        // Check if all essential parts are selected
        const required = ['cpu', 'motherboard', 'ram', 'storage', 'psu'];
        const missing = required.filter(req => !selections[req]);
        
        if (missing.length > 0) {
            alert("Iltimos, kompyuter ishlashi uchun zarur bo'lgan barcha qismlarni tanlang (CPU, Plata, RAM, Xotira, PSU)!");
        } else {
            alert("Buyurtmangiz qabul qilindi! Menejerlar tez orada bog'lanadi.");
        }
    });
});
