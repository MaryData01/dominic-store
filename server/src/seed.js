import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Admin from './models/Admin.js';
import Order from './models/Order.js';

dotenv.config();

const mockProducts = [
  // Keyboards
  {
    name: 'Apex Pro TKL Mechanical Keyboard',
    slug: 'apex-pro-tkl',
    category: 'keyboards',
    price: 125000,
    comparePrice: 150000,
    description: 'The world’s fastest and most advanced keyboard performs effortlessly for all undertakings.',
    specs: { Switch: 'OmniPoint Adjustable', FormFactor: 'Tenkeyless (TKL)', RGB: 'Per-key' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/c378e30ef4397bfaf32edad77436b35c_nha0hw.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/Keyboard_Custom_Keycaps_Gaming_Setup_PC_Gaming_Aesthetic_Aesthetic_Gaming_Setup_k1fwkp.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/aesthetic_pink_and_white_keyboard_rk61_bjoih0.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['mechanical', 'tkl', 'gaming'],
    rating: { average: 4.8, count: 128 }
  },
  {
    name: 'Logitech G915 LIGHTSPEED',
    slug: 'logitech-g915',
    category: 'keyboards',
    price: 185000,
    description: 'A breakthrough in design and engineering. Features LIGHTSPEED pro-grade wireless.',
    specs: { Switch: 'Low Profile GL', FormFactor: 'Full Size', Wireless: 'Yes' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Keyboard_%EF%B8%8F_wzcu8b.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/Keyboard_Custom_Keycaps_Gaming_Setup_PC_Gaming_Aesthetic_Aesthetic_Gaming_Setup_k1fwkp.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/aesthetic_pink_and_white_keyboard_rk61_bjoih0.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['wireless', 'low-profile'],
    rating: { average: 4.6, count: 85 }
  },
  {
    name: 'Razer Huntsman V3 Pro TKL',
    slug: 'razer-huntsman-v3-pro-tkl',
    category: 'keyboards',
    price: 165000,
    description: 'Enter the next level of analog optical switch keyboard technology.',
    specs: { Switch: 'Analog Optical', FormFactor: 'Tenkeyless (TKL)', RGB: 'Chroma RGB' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/c378e30ef4397bfaf32edad77436b35c_nha0hw.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Keyboard_%EF%B8%8F_wzcu8b.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/aesthetic_pink_and_white_keyboard_rk61_bjoih0.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['analog', 'optical', 'tkl'],
    rating: { average: 4.7, count: 42 }
  },
  // Mice
  {
    name: 'Razer DeathAdder V3 Pro',
    slug: 'razer-deathadder-v3-pro',
    category: 'mice',
    price: 95000,
    comparePrice: 110000,
    description: 'Victory takes on a new shape. Refined and reforged with the aid of top esports pros.',
    specs: { Weight: '63g', Sensor: 'Focus Pro 30K Optical', Battery: 'Up to 90 hours' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650567/Wireless_LED_Gaming_Mouse_scqy4z.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/Black_and_Red_Gaming_Mouse_cyni1l.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/680abeba34eee87b710d117e65cc6190_smrkla.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['wireless', 'esports', 'lightweight'],
    rating: { average: 4.9, count: 210 }
  },
  {
    name: 'Logitech G PRO X SUPERLIGHT',
    slug: 'logitech-g-pro-x-superlight',
    category: 'mice',
    price: 85000,
    description: 'Zero opposition. Designed with pros, engineered to win.',
    specs: { Weight: '<63g', Sensor: 'HERO 25K', Wireless: 'LIGHTSPEED' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/680abeba34eee87b710d117e65cc6190_smrkla.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650567/Wireless_LED_Gaming_Mouse_scqy4z.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/Black_and_Red_Gaming_Mouse_cyni1l.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['wireless', 'fps'],
    rating: { average: 4.7, count: 340 }
  },
  {
    name: 'Logitech G502 LIGHTSPEED',
    slug: 'logitech-g502-lightspeed',
    category: 'mice',
    price: 110000,
    description: 'Iconic gaming mouse upgraded with LIGHTSPEED wireless and HERO 25K sensor.',
    specs: { Weight: '114g', Sensor: 'HERO 25K', Buttons: '11 Programmable' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/Black_and_Red_Gaming_Mouse_cyni1l.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650567/Wireless_LED_Gaming_Mouse_scqy4z.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/680abeba34eee87b710d117e65cc6190_smrkla.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['wireless', 'programmable', 'rgb'],
    rating: { average: 4.8, count: 185 }
  },
  // Headsets
  {
    name: 'SteelSeries Arctis Nova Pro',
    slug: 'arctis-nova-pro',
    category: 'headsets',
    price: 245000,
    comparePrice: 260000,
    description: 'Almighty Audio. Reach ultimate gaming immersion with Active Noise Cancellation.',
    specs: { Audio: 'High-Res Capable', ANC: 'Yes', Battery: 'Infinity Power System' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/Sleek_Pink_High-Fidelity_Gaming_Headset_with_Elegant_Design_ftpuyo.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/60ea5f6278dc23902857dee86d06aff0_vx3ua4.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650562/1f4bf54e529b9f829fa524eea234dd21_lwon51.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['premium', 'anc', 'wireless'],
    rating: { average: 4.8, count: 55 }
  },
  {
    name: 'HyperX Cloud III Wireless',
    slug: 'hyperx-cloud-iii-wireless',
    category: 'headsets',
    price: 115000,
    description: 'A legend reborn. Known for its signature comfort and durable aluminum frame.',
    specs: { Drivers: '53mm', Battery: 'Up to 120 hours', Mic: 'Detachable Noise-cancelling' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650562/HEADS_1_jnjqcn.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/Sleek_Pink_High-Fidelity_Gaming_Headset_with_Elegant_Design_ftpuyo.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/60ea5f6278dc23902857dee86d06aff0_vx3ua4.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['wireless', 'comfort'],
    rating: { average: 4.5, count: 90 }
  },
  {
    name: 'Razer BlackShark V2 Pro (2023)',
    slug: 'razer-blackshark-v2-pro',
    category: 'headsets',
    price: 135000,
    description: 'The definitive esports gaming headset, now upgraded for next-level competitive play.',
    specs: { Drivers: '50mm TriForce', Battery: 'Up to 70 hours', Mic: 'Super Wideband' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/60ea5f6278dc23902857dee86d06aff0_vx3ua4.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650562/1f4bf54e529b9f829fa524eea234dd21_lwon51.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650562/HEADS_1_jnjqcn.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['esports', 'wireless', 'microphone'],
    rating: { average: 4.7, count: 68 }
  },
  // Monitors
  {
    name: 'Alienware 34" QD-OLED (AW3423DWF)',
    slug: 'alienware-34-qd-oled',
    category: 'monitors',
    price: 750000,
    comparePrice: 800000,
    description: 'The ultimate visual experience. Deep blacks, infinite contrast, and vibrant colors.',
    specs: { Panel: 'QD-OLED', Resolution: '3440x1440', RefreshRate: '165Hz' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Monitor_Setup_Idea_hivphi.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Monitor_Setup_Idea_hivphi.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['oled', 'ultrawide', 'premium'],
    rating: { average: 4.9, count: 45 }
  },
  {
    name: 'LG UltraGear 27" 1440p 165Hz',
    slug: 'lg-ultragear-27',
    category: 'monitors',
    price: 320000,
    description: 'Be the game changer. 1ms (GtG) response time and 165Hz refresh rate.',
    specs: { Panel: 'Nano IPS', Resolution: '2560x1440', RefreshRate: '165Hz' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Monitor_Setup_Idea_hivphi.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Monitor_Setup_Idea_hivphi.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['1440p', '165hz', 'ips'],
    rating: { average: 4.6, count: 112 }
  },
  {
    name: 'ASUS ROG Swift PG27AQDM',
    slug: 'asus-rog-swift-pg27aqdm',
    category: 'monitors',
    price: 680000,
    description: 'High-speed performance with stunning OLED visuals, 240Hz refresh rate, and 0.03ms response time.',
    specs: { Panel: 'OLED', Resolution: '2560x1440', RefreshRate: '240Hz' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Monitor_Setup_Idea_hivphi.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Gaming_Monitor_Setup_Idea_hivphi.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['oled', '240hz', 'gaming'],
    rating: { average: 4.9, count: 38 }
  },
  // Controllers
  {
    name: 'Xbox Elite Wireless Controller Series 2',
    slug: 'xbox-elite-series-2',
    category: 'controllers',
    price: 135000,
    description: 'Play like a pro with the world’s most advanced controller.',
    specs: { Connectivity: 'Xbox Wireless, Bluetooth, USB-C', Battery: 'Up to 40 hours' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650566/Custom_Xbox_Controller_Lightning_Edition___Soft_Touch_Grip_Electric_Design_twuyum.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650567/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D0%B0%D1%8F_%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%B0%D1%8F_%D0%BF%D1%80%D0%B8%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0_Playstation_5_qc1tim.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/eb798be309bf03eb596276733c2e438d_sh3qwo.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['xbox', 'pc', 'pro'],
    rating: { average: 4.4, count: 200 }
  },
  {
    name: 'Sony DualSense Edge',
    slug: 'dualsense-edge',
    category: 'controllers',
    price: 155000,
    description: 'Get an edge in gameplay with customizable controls and swappable profiles.',
    specs: { Connectivity: 'Bluetooth, USB-C', Features: 'Haptic feedback, Adaptive triggers' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/eb798be309bf03eb596276733c2e438d_sh3qwo.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650566/Custom_Xbox_Controller_Lightning_Edition___Soft_Touch_Grip_Electric_Design_twuyum.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650567/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D0%B0%D1%8F_%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%B0%D1%8F_%D0%BF%D1%80%D0%B8%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0_Playstation_5_qc1tim.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['ps5', 'pc', 'customizable'],
    rating: { average: 4.7, count: 88 }
  },
  {
    name: 'Razer Wolverine V2 Pro',
    slug: 'razer-wolverine-v2-pro',
    category: 'controllers',
    price: 195000,
    description: 'Pro gaming wireless controller for PS5 and PC with HyperTrigger technology.',
    specs: { Connectivity: 'Wireless / Wired', MechaTactile: 'Yes', BackButtons: '4 Remapable' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650566/Custom_Xbox_Controller_Lightning_Edition___Soft_Touch_Grip_Electric_Design_twuyum.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/eb798be309bf03eb596276733c2e438d_sh3qwo.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650567/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%BD%D0%B0%D1%8F_%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%B0%D1%8F_%D0%BF%D1%80%D0%B8%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0_Playstation_5_qc1tim.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['ps5', 'pc', 'wireless'],
    rating: { average: 4.6, count: 29 }
  },
  // Chairs
  {
    name: 'Secretlab TITAN Evo 2022',
    slug: 'secretlab-titan-evo',
    category: 'chairs',
    price: 350000,
    description: 'The award-winning gaming chair, engineered for all-day comfort.',
    specs: { Material: 'NEO Hybrid Leatherette', Ergonomics: '4-way L-ADAPT Lumbar' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650566/Cyberpunk-Inspired_Gaming_Chair_with_LED_Accents_rlmsiy.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Best_Gaming_Chair_for_Comfort_Performance_in_2026_z3aghe.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650563/13_Best_Gaming_Chairs_Expert_Picks_and_Reviews_d5opbn.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['ergonomic', 'premium'],
    rating: { average: 4.8, count: 410 }
  },
  {
    name: 'Herman Miller x Logitech G Embody',
    slug: 'herman-miller-embody',
    category: 'chairs',
    price: 1200000,
    description: 'The ultimate gaming chair. Science-backed ergonomics for peak performance.',
    specs: { Material: 'Cooling Foam', Warranty: '12-year' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650562/4b100d076aaae05a457a5a0e4e95ec2c_wntsds.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650562/_Futuristic_Gaming_Chair_with_RGB_Lighting_and_Ergonomic_Design__xp954l.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650563/download_15_ohlsmg.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['luxury', 'ergonomic'],
    rating: { average: 4.9, count: 32 }
  },
  {
    name: 'Razer Iskur V2',
    slug: 'razer-iskur-v2',
    category: 'chairs',
    price: 450000,
    description: 'Perfect gaming form with adaptive lumbar support and premium high-density cushioning.',
    specs: { Material: 'EPU Synthetic Leather', Ergonomics: 'Adaptive Lumbar Support' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Best_Gaming_Chair_for_Comfort_Performance_in_2026_z3aghe.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650563/13_Best_Gaming_Chairs_Expert_Picks_and_Reviews_d5opbn.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650566/Cyberpunk-Inspired_Gaming_Chair_with_LED_Accents_rlmsiy.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['ergonomic', 'premium', 'leather'],
    rating: { average: 4.7, count: 54 }
  },
  // Capture Cards
  {
    name: 'Elgato HD60 X',
    slug: 'elgato-hd60-x',
    category: 'capture-cards',
    price: 145000,
    description: 'Capture your PS5 or Xbox gameplay like a pro. VRR passthrough support.',
    specs: { Capture: '1080p60 / 4K30', Passthrough: '4K60 HDR10 / 1440p120' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687727/Elgato_4K_PRO_8K60_Passthrough_Game_Capture_Card_njsjst.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687675/Elgato_s_new_capture_card_will_let_you_stream_4K____cm31qo.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687681/The_Best_Xbox_Series_X_and_Series_S_Accessories_To_Level_Up_Your_Console_Gaming_Setup_mal3ix.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['streaming', 'console'],
    rating: { average: 4.7, count: 150 }
  },
  {
    name: 'AVerMedia Live Gamer 4K',
    slug: 'avermedia-live-gamer-4k',
    category: 'capture-cards',
    price: 210000,
    description: 'PCIe capture card capable of recording 4K HDR content at 60 FPS.',
    specs: { Capture: '4K60 HDR', Interface: 'PCIe Gen2 x4', RGB: 'Yes' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687675/Elgato_s_new_capture_card_will_let_you_stream_4K____cm31qo.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687681/The_Best_Xbox_Series_X_and_Series_S_Accessories_To_Level_Up_Your_Console_Gaming_Setup_mal3ix.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687726/XIIXMASK_Video_Capture_Card_Audio_Video_Capture_Card_USB_3_0_Capture_Card_4K_HDMI_Loop-Out_1080P_60FPS_2K_30FPS_Video_Game_Capture_for_Streaming_kyvjnh.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['internal', '4k', 'streaming'],
    rating: { average: 4.5, count: 76 }
  },
  {
    name: 'Elgato 4K X',
    slug: 'elgato-4k-x',
    category: 'capture-cards',
    price: 185000,
    description: 'The ultimate external capture card with up to 4K144 streaming/capture support.',
    specs: { Capture: '4K144 / 1080p240', Interface: 'USB 3.2 Type-C' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687727/Elgato_4K_PRO_8K60_Passthrough_Game_Capture_Card_njsjst.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687681/The_Best_Xbox_Series_X_and_Series_S_Accessories_To_Level_Up_Your_Console_Gaming_Setup_mal3ix.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781687726/XIIXMASK_Video_Capture_Card_Audio_Video_Capture_Card_USB_3_0_Capture_Card_4K_HDMI_Loop-Out_1080P_60FPS_2K_30FPS_Video_Game_Capture_for_Streaming_kyvjnh.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['external', '4k', 'streaming'],
    rating: { average: 4.8, count: 18 }
  },
  // Lighting
  {
    name: 'Elgato Key Light',
    slug: 'elgato-key-light',
    category: 'lighting',
    price: 165000,
    description: 'Professional studio lighting engineered to make you look amazing.',
    specs: { Output: '2800 Lumens', Temperature: '2900 - 7000 K', Mount: 'Desk Mount included' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650567/Transform_Your_Home_with_LED_Strip_Lights_Modern_Cozy_Vibes_qjkhxb.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650566/Smart_WiFi_RGB_LED_Wall_Light_Lines_rfduez.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/RGB_light_setup_aesthetic_bb3fvx.jpg'
    ],
    stockStatus: 'in-stock',
    featured: true,
    tags: ['streaming', 'studio'],
    rating: { average: 4.8, count: 215 }
  },
  {
    name: 'Govee Glide Hexa Light Panels',
    slug: 'govee-glide-hexa',
    category: 'lighting',
    price: 110000,
    description: 'Customize your setup with vibrant, modular hexagonal light panels.',
    specs: { Connectivity: 'Wi-Fi / Bluetooth', Colors: 'RGBIC', Panels: '10 Pack' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650566/Vibrant_Purple_Ambient_RGB_Gaming_Desk_Setup_vmqtwm.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Aesthetic_LED_Gaming_setup_Ideas_oozpcy.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650563/Dream_room_kvacxm.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['rgb', 'decor'],
    rating: { average: 4.6, count: 320 }
  },
  {
    name: 'Philips Hue Play Light Bar (2-Pack)',
    slug: 'philips-hue-play',
    category: 'lighting',
    price: 145000,
    description: 'Create a vibrant ambient backlight for your gaming monitor or setup.',
    specs: { Output: '1060 Lumens', SmartHome: 'Hue Bridge required', Colors: '16 Million' },
    images: [
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650565/RGB_light_setup_aesthetic_bb3fvx.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650564/Aesthetic_LED_Gaming_setup_Ideas_oozpcy.jpg',
      'https://res.cloudinary.com/dteqdjdq3/image/upload/q_auto,f_auto/v1781650563/Dream_room_kvacxm.jpg'
    ],
    stockStatus: 'in-stock',
    featured: false,
    tags: ['rgb', 'ambient', 'smart'],
    rating: { average: 4.7, count: 120 }
  }
];

const importData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI missing. Add it to .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    // Drop all collections completely
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (let collection of collections) {
      await db.collection(collection.name).drop();
    }
    console.log('All collections dropped successfully');

    // Create Admin
    await Admin.create({
      email: 'admin@dominicstore.com',
      password: 'Admin1234!',
    });

    // Insert Products
    await Product.insertMany(mockProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
