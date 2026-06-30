// data.js
// Bu mock ma'lumotlar bazasi (Prays). Haqiqiy prays kelguncha shundan foydalanamiz.

const marginSetting = {
    type: 'percentage', // 'percentage' yoki 'fixed'
    value: 10 // 10% marja. Agar type 'fixed' bo'lsa $10 bo'ladi.
};

const components = {
    cpu: [
        { id: 'c1', name: 'Intel-Core i5 - 12400F (2.7 GHz, 18MB, LGA1700)', price: 135, socket: 'LGA1700', tdp: 65, ram_type: ['DDR4', 'DDR5'] },
        { id: 'c2', name: 'Intel-Core i5 - 13400F (2.5 GHz, 20MB, LGA1700)', price: 185, socket: 'LGA1700', tdp: 65, ram_type: ['DDR4', 'DDR5'] },
        { id: 'c3', name: 'Intel-Core i7 - 14700K (3.4 GHz, 33MB, LGA1700)', price: 400, socket: 'LGA1700', tdp: 125, ram_type: ['DDR4', 'DDR5'] },
        { id: 'c4', name: 'AMD Ryzen 5 5600 (3.5 GHz, 6 cores, AM4)', price: 130, socket: 'AM4', tdp: 65, ram_type: ['DDR4'] },
        { id: 'c5', name: 'AMD Ryzen 5 7500F (3.7 GHz, 6 cores, AM5)', price: 180, socket: 'AM5', tdp: 65, ram_type: ['DDR5'] },
        { id: 'c6', name: 'AMD Ryzen 7 7800X3D (4.2 GHz, 8 cores, AM5)', price: 450, socket: 'AM5', tdp: 120, ram_type: ['DDR5'] }
    ],
    motherboard: [
        { id: 'm1', name: 'Gigabyte H610M K', price: 75, socket: 'LGA1700', ram_type: ['DDR4'], form_factor: 'Micro-ATX' },
        { id: 'm2', name: 'MSI PRO B760M-A WiFi', price: 150, socket: 'LGA1700', ram_type: ['DDR5'], form_factor: 'Micro-ATX' },
        { id: 'm3', name: 'Asus Prime B550M-K', price: 95, socket: 'AM4', ram_type: ['DDR4'], form_factor: 'Micro-ATX' },
        { id: 'm4', name: 'MSI PRO B650M-P', price: 140, socket: 'AM5', ram_type: ['DDR5'], form_factor: 'Micro-ATX' }
    ],
    ram: [
        { id: 'r1', name: 'Lexar DDR4 16GB 3200MHz', price: 35, type: 'DDR4', capacity: '16GB' },
        { id: 'r2', name: 'Kingston DDR4 16GB 3200MHz RGB', price: 45, type: 'DDR4', capacity: '16GB' },
        { id: 'r3', name: 'Apacer DDR5 16GB 5600MHz', price: 50, type: 'DDR5', capacity: '16GB' },
        { id: 'r4', name: 'Lexar DDR5 32GB (16*2) 6000MHz RGB', price: 110, type: 'DDR5', capacity: '32GB' },
        { id: 'r5', name: 'Teamgroup DDR5 32GB 5600MHz RGB', price: 105, type: 'DDR5', capacity: '32GB' }
    ],
    gpu: [
        { id: 'g0', name: 'Videokartasiz (Protsessor grafikasi)', price: 0, recommended_psu: 0 },
        { id: 'g1', name: 'Nvidia RTX 3060 12GB', price: 290, recommended_psu: 500 },
        { id: 'g2', name: 'Nvidia RTX 4060 8GB', price: 310, recommended_psu: 550 },
        { id: 'g3', name: 'AMD Radeon RX 6600 8GB', price: 200, recommended_psu: 450 },
        { id: 'g4', name: 'Nvidia GTX 1650 4GB', price: 140, recommended_psu: 300 }
    ],
    storage: [
        { id: 's1', name: 'Lexar NM620 512GB NVMe M.2', price: 35, type: 'NVMe' },
        { id: 's2', name: 'Kingston NV2 1TB NVMe M.2', price: 60, type: 'NVMe' },
        { id: 's3', name: 'Crucial BX500 500GB SATA', price: 30, type: 'SATA' }
    ],
    psu: [
        { id: 'p1', name: 'DeepCool PF450 450W', price: 35, wattage: 450 },
        { id: 'p2', name: 'DeepCool PF550 550W', price: 42, wattage: 550 },
        { id: 'p3', name: 'Cougar VTE 600W 80+ Bronze', price: 55, wattage: 600 },
        { id: 'p4', name: 'Corsair RM750e 750W 80+ Gold', price: 110, wattage: 750 }
    ],
    case: [
        { id: 'ca1', name: 'Zalman N4 Rev.1 (4 fans)', price: 45, form_factors: ['ATX', 'Micro-ATX'] },
        { id: 'ca2', name: 'DeepCool MATREXX 40 3FS', price: 42, form_factors: ['Micro-ATX'] },
        { id: 'ca3', name: 'Gamemax Aero Mini', price: 38, form_factors: ['Micro-ATX'] }
    ],
    cooler: [
        { id: 'co0', name: 'BOX (Protsessor bilan keladi)', price: 0, sockets: ['LGA1700', 'LGA1200', 'AM4', 'AM5', 'LGA1155'] },
        { id: 'co1', name: 'DeepCool AG300', price: 15, sockets: ['LGA1700', 'LGA1200', 'AM4', 'AM5'] },
        { id: 'co2', name: 'DeepCool AG400 ARGB', price: 25, sockets: ['LGA1700', 'LGA1200', 'AM4', 'AM5'] }
    ]
};
