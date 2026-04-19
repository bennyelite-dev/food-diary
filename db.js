// ===== Food Database & LocalStorage CRUD =====

const KEYS = {
  foods: 'food_db',
  log:   'food_log',
  goals: 'user_goals',
};

const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 200, fat: 65 };

// All values per 100g (or per stated unit with grams = unit weight)
const INITIAL_FOODS = [

  // ─── פירות ───
  { id:'fr01', name:'תפוח',               category:'פירות',          cal:52,  protein:0.3,  carbs:14,   fat:0.2,  unit:'יחידה',   grams:182 },
  { id:'fr02', name:'אגס',                category:'פירות',          cal:57,  protein:0.4,  carbs:15,   fat:0.1,  unit:'יחידה',   grams:178 },
  { id:'fr03', name:'בננה',               category:'פירות',          cal:89,  protein:1.1,  carbs:23,   fat:0.3,  unit:'יחידה',   grams:120 },
  { id:'fr04', name:'תפוז',               category:'פירות',          cal:47,  protein:0.9,  carbs:12,   fat:0.1,  unit:'יחידה',   grams:131 },
  { id:'fr05', name:'מנדרינה',            category:'פירות',          cal:53,  protein:0.8,  carbs:13,   fat:0.3,  unit:'יחידה',   grams:88  },
  { id:'fr06', name:'ענבים',              category:'פירות',          cal:69,  protein:0.7,  carbs:18,   fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'fr07', name:'אבטיח',              category:'פירות',          cal:30,  protein:0.6,  carbs:7.6,  fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'fr08', name:'מלון',               category:'פירות',          cal:34,  protein:0.8,  carbs:8,    fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'fr09', name:'תות שדה',            category:'פירות',          cal:33,  protein:0.7,  carbs:8,    fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'fr10', name:'אוכמניות',           category:'פירות',          cal:57,  protein:0.7,  carbs:14,   fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'fr11', name:'פטל',                category:'פירות',          cal:52,  protein:1.2,  carbs:12,   fat:0.6,  unit:'100 גרם', grams:100 },
  { id:'fr12', name:'מנגו',               category:'פירות',          cal:60,  protein:0.8,  carbs:15,   fat:0.4,  unit:'יחידה',   grams:200 },
  { id:'fr13', name:'אננס',               category:'פירות',          cal:50,  protein:0.5,  carbs:13,   fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'fr14', name:'קיווי',              category:'פירות',          cal:61,  protein:1.1,  carbs:15,   fat:0.5,  unit:'יחידה',   grams:76  },
  { id:'fr15', name:'אפרסק',              category:'פירות',          cal:39,  protein:0.9,  carbs:10,   fat:0.3,  unit:'יחידה',   grams:150 },
  { id:'fr16', name:'שזיף',               category:'פירות',          cal:46,  protein:0.7,  carbs:11,   fat:0.3,  unit:'יחידה',   grams:66  },
  { id:'fr17', name:'דובדבן',             category:'פירות',          cal:50,  protein:1,    carbs:12,   fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'fr18', name:'לימון',              category:'פירות',          cal:29,  protein:1.1,  carbs:9,    fat:0.3,  unit:'יחידה',   grams:84  },
  { id:'fr19', name:'גרפרוט',             category:'פירות',          cal:42,  protein:0.8,  carbs:11,   fat:0.1,  unit:'יחידה',   grams:236 },
  { id:'fr20', name:'רימון',              category:'פירות',          cal:83,  protein:1.7,  carbs:19,   fat:1.2,  unit:'יחידה',   grams:282 },
  { id:'fr21', name:'תמר',                category:'פירות',          cal:277, protein:1.8,  carbs:75,   fat:0.2,  unit:'יחידה',   grams:24  },
  { id:'fr22', name:'תאנה',               category:'פירות',          cal:74,  protein:0.8,  carbs:19,   fat:0.3,  unit:'יחידה',   grams:50  },
  { id:'fr23', name:'אבוקדו',             category:'פירות',          cal:160, protein:2,    carbs:9,    fat:15,   unit:'יחידה',   grams:150 },
  { id:'fr24', name:'פפאיה',              category:'פירות',          cal:43,  protein:0.5,  carbs:11,   fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'fr25', name:'ליצ׳י',              category:'פירות',          cal:66,  protein:0.8,  carbs:17,   fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'fr26', name:'פסיפלורה',           category:'פירות',          cal:97,  protein:2.2,  carbs:23,   fat:0.7,  unit:'יחידה',   grams:18  },
  { id:'fr27', name:'גויאבה',             category:'פירות',          cal:68,  protein:2.6,  carbs:14,   fat:1,    unit:'יחידה',   grams:90  },
  { id:'fr28', name:'צנובר',              category:'פירות',          cal:673, protein:13.7, carbs:13.1, fat:68.4, unit:'100 גרם', grams:100 },
  { id:'fr29', name:'קוקוס טרי',          category:'פירות',          cal:354, protein:3.3,  carbs:15,   fat:33,   unit:'100 גרם', grams:100 },
  { id:'fr30', name:'משמש',               category:'פירות',          cal:48,  protein:1.4,  carbs:11,   fat:0.4,  unit:'יחידה',   grams:35  },

  // ─── ירקות ───
  { id:'vg01', name:'עגבניה',             category:'ירקות',          cal:18,  protein:0.9,  carbs:3.9,  fat:0.2,  unit:'יחידה',   grams:123 },
  { id:'vg02', name:'מלפפון',             category:'ירקות',          cal:16,  protein:0.7,  carbs:3.6,  fat:0.1,  unit:'יחידה',   grams:280 },
  { id:'vg03', name:'גזר',                category:'ירקות',          cal:41,  protein:0.9,  carbs:10,   fat:0.2,  unit:'יחידה',   grams:61  },
  { id:'vg04', name:'ברוקולי',            category:'ירקות',          cal:34,  protein:2.8,  carbs:7,    fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'vg05', name:'כרובית',             category:'ירקות',          cal:25,  protein:1.9,  carbs:5,    fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'vg06', name:'תרד',                category:'ירקות',          cal:23,  protein:2.9,  carbs:3.6,  fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'vg07', name:'חסה',                category:'ירקות',          cal:15,  protein:1.4,  carbs:2.9,  fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'vg08', name:'פלפל אדום',          category:'ירקות',          cal:31,  protein:1,    carbs:6,    fat:0.3,  unit:'יחידה',   grams:119 },
  { id:'vg09', name:'פלפל ירוק',          category:'ירקות',          cal:20,  protein:0.9,  carbs:4.6,  fat:0.2,  unit:'יחידה',   grams:119 },
  { id:'vg10', name:'פלפל צהוב',          category:'ירקות',          cal:27,  protein:1,    carbs:6.3,  fat:0.2,  unit:'יחידה',   grams:119 },
  { id:'vg11', name:'בצל',                category:'ירקות',          cal:40,  protein:1.1,  carbs:9.3,  fat:0.1,  unit:'יחידה',   grams:110 },
  { id:'vg12', name:'שום',                category:'ירקות',          cal:149, protein:6.4,  carbs:33,   fat:0.5,  unit:'שן',      grams:3   },
  { id:'vg13', name:'תפוח אדמה',          category:'ירקות',          cal:77,  protein:2,    carbs:17,   fat:0.1,  unit:'יחידה',   grams:150 },
  { id:'vg14', name:'בטטה',               category:'ירקות',          cal:86,  protein:1.6,  carbs:20,   fat:0.1,  unit:'יחידה',   grams:130 },
  { id:'vg15', name:'קישוא',              category:'ירקות',          cal:17,  protein:1.2,  carbs:3.1,  fat:0.3,  unit:'יחידה',   grams:196 },
  { id:'vg16', name:'חציל',               category:'ירקות',          cal:25,  protein:1,    carbs:6,    fat:0.2,  unit:'יחידה',   grams:458 },
  { id:'vg17', name:'כרוב לבן',           category:'ירקות',          cal:25,  protein:1.3,  carbs:6,    fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'vg18', name:'כרוב סגול',          category:'ירקות',          cal:31,  protein:1.4,  carbs:7.4,  fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'vg19', name:'סלרי',               category:'ירקות',          cal:16,  protein:0.7,  carbs:3,    fat:0.2,  unit:'גבעול',   grams:40  },
  { id:'vg20', name:'פטריות',             category:'ירקות',          cal:22,  protein:3.1,  carbs:3.3,  fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'vg21', name:'תירס',               category:'ירקות',          cal:86,  protein:3.3,  carbs:19,   fat:1.4,  unit:'קלח',     grams:90  },
  { id:'vg22', name:'אפונה',              category:'ירקות',          cal:81,  protein:5.4,  carbs:14,   fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'vg23', name:'שעועית ירוקה',       category:'ירקות',          cal:31,  protein:1.8,  carbs:7,    fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'vg24', name:'כרישה',              category:'ירקות',          cal:61,  protein:1.5,  carbs:14,   fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'vg25', name:'סלק',                category:'ירקות',          cal:43,  protein:1.6,  carbs:10,   fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'vg26', name:'ארטישוק',            category:'ירקות',          cal:47,  protein:3.3,  carbs:11,   fat:0.2,  unit:'יחידה',   grams:128 },
  { id:'vg27', name:'אספרגוס',            category:'ירקות',          cal:20,  protein:2.2,  carbs:3.9,  fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'vg28', name:'צנון',               category:'ירקות',          cal:16,  protein:0.7,  carbs:3.4,  fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'vg29', name:'כוסברה',             category:'ירקות',          cal:23,  protein:2.1,  carbs:3.7,  fat:0.5,  unit:'100 גרם', grams:100 },
  { id:'vg30', name:'פטרוזיליה',          category:'ירקות',          cal:36,  protein:3,    carbs:6.3,  fat:0.8,  unit:'100 גרם', grams:100 },
  { id:'vg31', name:'בצל ירוק',           category:'ירקות',          cal:32,  protein:1.8,  carbs:7.3,  fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'vg32', name:'שמיר',               category:'ירקות',          cal:43,  protein:3.5,  carbs:7,    fat:1.1,  unit:'100 גרם', grams:100 },
  { id:'vg33', name:'גרגר נחלים',         category:'ירקות',          cal:22,  protein:2.2,  carbs:2.3,  fat:0.7,  unit:'100 גרם', grams:100 },
  { id:'vg34', name:'עלי רוקט',           category:'ירקות',          cal:25,  protein:2.6,  carbs:3.7,  fat:0.7,  unit:'100 גרם', grams:100 },
  { id:'vg35', name:'פרי ים (ממי)',        category:'ירקות',          cal:47,  protein:3.3,  carbs:9.1,  fat:0.2,  unit:'100 גרם', grams:100 },

  // ─── דגנים ולחם ───
  { id:'gr01', name:'אורז לבן מבושל',     category:'דגנים ולחם',     cal:130, protein:2.7,  carbs:28,   fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'gr02', name:'אורז מלא מבושל',     category:'דגנים ולחם',     cal:111, protein:2.6,  carbs:23,   fat:0.9,  unit:'100 גרם', grams:100 },
  { id:'gr03', name:'פסטה מבושלת',        category:'דגנים ולחם',     cal:131, protein:5,    carbs:25,   fat:1.1,  unit:'100 גרם', grams:100 },
  { id:'gr04', name:'ספגטי מבושל',        category:'דגנים ולחם',     cal:158, protein:5.8,  carbs:31,   fat:0.9,  unit:'100 גרם', grams:100 },
  { id:'gr05', name:'לחם לבן',            category:'דגנים ולחם',     cal:265, protein:9,    carbs:49,   fat:3.2,  unit:'פרוסה',   grams:28  },
  { id:'gr06', name:'לחם מלא',            category:'דגנים ולחם',     cal:247, protein:13,   carbs:41,   fat:4.2,  unit:'פרוסה',   grams:28  },
  { id:'gr07', name:'לחם שיפון',          category:'דגנים ולחם',     cal:259, protein:8.5,  carbs:48,   fat:3.3,  unit:'פרוסה',   grams:32  },
  { id:'gr08', name:'שיבולת שועל',        category:'דגנים ולחם',     cal:389, protein:17,   carbs:66,   fat:7,    unit:'100 גרם', grams:100 },
  { id:'gr09', name:'קינואה מבושלת',      category:'דגנים ולחם',     cal:120, protein:4.4,  carbs:22,   fat:1.9,  unit:'100 גרם', grams:100 },
  { id:'gr10', name:'כוסמת מבושלת',       category:'דגנים ולחם',     cal:92,  protein:3.4,  carbs:20,   fat:0.6,  unit:'100 גרם', grams:100 },
  { id:'gr11', name:'בורגול מבושל',       category:'דגנים ולחם',     cal:83,  protein:3,    carbs:19,   fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'gr12', name:'קוסקוס מבושל',       category:'דגנים ולחם',     cal:112, protein:3.8,  carbs:23,   fat:0.2,  unit:'100 גרם', grams:100 },
  { id:'gr13', name:'פיתה',               category:'דגנים ולחם',     cal:265, protein:9,    carbs:55,   fat:1.2,  unit:'יחידה',   grams:60  },
  { id:'gr14', name:'לאפה',               category:'דגנים ולחם',     cal:290, protein:8,    carbs:53,   fat:5,    unit:'יחידה',   grams:80  },
  { id:'gr15', name:'בגט',                category:'דגנים ולחם',     cal:274, protein:9.6,  carbs:53,   fat:1.6,  unit:'פרוסה',   grams:35  },
  { id:'gr16', name:'קרקר',               category:'דגנים ולחם',     cal:402, protein:10,   carbs:68,   fat:12,   unit:'יחידה',   grams:10  },
  { id:'gr17', name:'קורנפלקס',           category:'דגנים ולחם',     cal:357, protein:7.5,  carbs:84,   fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'gr18', name:'גרנולה',             category:'דגנים ולחם',     cal:471, protein:9,    carbs:64,   fat:20,   unit:'100 גרם', grams:100 },
  { id:'gr19', name:'פריכיות אורז',       category:'דגנים ולחם',     cal:387, protein:7.4,  carbs:81,   fat:2.8,  unit:'יחידה',   grams:9   },
  { id:'gr20', name:'טורטיה קמח',         category:'דגנים ולחם',     cal:312, protein:8,    carbs:51,   fat:8,    unit:'יחידה',   grams:45  },
  { id:'gr21', name:'פנקייק',             category:'דגנים ולחם',     cal:227, protein:6.4,  carbs:32,   fat:9.1,  unit:'יחידה',   grams:38  },
  { id:'gr22', name:'וופל',               category:'דגנים ולחם',     cal:291, protein:7.9,  carbs:37,   fat:13,   unit:'יחידה',   grams:75  },
  { id:'gr23', name:'אורז בסמטי מבושל',   category:'דגנים ולחם',     cal:121, protein:3.5,  carbs:25,   fat:0.4,  unit:'100 גרם', grams:100 },

  // ─── קטניות ───
  { id:'lg01', name:'עדשים מבושלות',      category:'קטניות',         cal:116, protein:9,    carbs:20,   fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'lg02', name:'עדשים כתומות',       category:'קטניות',         cal:116, protein:9,    carbs:20,   fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'lg03', name:'גרגרי חומוס מבושל',  category:'קטניות',         cal:164, protein:8.9,  carbs:27,   fat:2.6,  unit:'100 גרם', grams:100 },
  { id:'lg04', name:'שעועית שחורה',       category:'קטניות',         cal:132, protein:8.9,  carbs:24,   fat:0.5,  unit:'100 גרם', grams:100 },
  { id:'lg05', name:'שעועית לבנה',        category:'קטניות',         cal:139, protein:9.7,  carbs:25,   fat:0.5,  unit:'100 גרם', grams:100 },
  { id:'lg06', name:'פול מבושל',          category:'קטניות',         cal:110, protein:7.6,  carbs:20,   fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'lg07', name:'פולי סויה',          category:'קטניות',         cal:173, protein:16.6, carbs:9.9,  fat:9,    unit:'100 גרם', grams:100 },
  { id:'lg08', name:'אדממה',              category:'קטניות',         cal:122, protein:11,   carbs:8.9,  fat:5.2,  unit:'100 גרם', grams:100 },
  { id:'lg09', name:'טופו',               category:'קטניות',         cal:76,  protein:8,    carbs:1.9,  fat:4.8,  unit:'100 גרם', grams:100 },
  { id:'lg10', name:'חומוס טחון (מוצר)',  category:'קטניות',         cal:166, protein:7.9,  carbs:14,   fat:9.6,  unit:'100 גרם', grams:100 },

  // ─── בשר ועוף ───
  { id:'me01', name:'חזה עוף',            category:'בשר ועוף',       cal:165, protein:31,   carbs:0,    fat:3.6,  unit:'100 גרם', grams:100 },
  { id:'me02', name:'ירך עוף',            category:'בשר ועוף',       cal:209, protein:26,   carbs:0,    fat:11,   unit:'100 גרם', grams:100 },
  { id:'me03', name:'עוף שלם',            category:'בשר ועוף',       cal:215, protein:18,   carbs:0,    fat:15,   unit:'100 גרם', grams:100 },
  { id:'me04', name:'כנפיים',             category:'בשר ועוף',       cal:290, protein:27,   carbs:0,    fat:20,   unit:'100 גרם', grams:100 },
  { id:'me05', name:'בשר בקר טחון 80%',  category:'בשר ועוף',       cal:254, protein:17,   carbs:0,    fat:20,   unit:'100 גרם', grams:100 },
  { id:'me06', name:'בשר בקר טחון 90%',  category:'בשר ועוף',       cal:218, protein:20,   carbs:0,    fat:15,   unit:'100 גרם', grams:100 },
  { id:'me07', name:'סטייק אנטריקוט',     category:'בשר ועוף',       cal:291, protein:24,   carbs:0,    fat:21,   unit:'100 גרם', grams:100 },
  { id:'me08', name:'פילה בקר',           category:'בשר ועוף',       cal:207, protein:28,   carbs:0,    fat:10,   unit:'100 גרם', grams:100 },
  { id:'me09', name:'כבש',                category:'בשר ועוף',       cal:294, protein:25,   carbs:0,    fat:21,   unit:'100 גרם', grams:100 },
  { id:'me10', name:'הודו חזה',           category:'בשר ועוף',       cal:135, protein:30,   carbs:0,    fat:1,    unit:'100 גרם', grams:100 },
  { id:'me11', name:'ברווז',              category:'בשר ועוף',       cal:337, protein:19,   carbs:0,    fat:28,   unit:'100 גרם', grams:100 },
  { id:'me12', name:'כבד עוף',            category:'בשר ועוף',       cal:165, protein:24,   carbs:1,    fat:6.5,  unit:'100 גרם', grams:100 },
  { id:'me13', name:'כבד בקר',            category:'בשר ועוף',       cal:175, protein:26,   carbs:4,    fat:5,    unit:'100 גרם', grams:100 },
  { id:'me14', name:'נקניקיות',           category:'בשר ועוף',       cal:290, protein:12,   carbs:2,    fat:26,   unit:'יחידה',   grams:57  },
  { id:'me15', name:'קבב',                category:'בשר ועוף',       cal:255, protein:18,   carbs:8,    fat:17,   unit:'100 גרם', grams:100 },
  { id:'me16', name:'המבורגר',            category:'בשר ועוף',       cal:295, protein:17,   carbs:0,    fat:24,   unit:'100 גרם', grams:100 },
  { id:'me17', name:'חזיר (צלעות)',       category:'בשר ועוף',       cal:242, protein:27,   carbs:0,    fat:14,   unit:'100 גרם', grams:100 },
  { id:'me18', name:'בייקון',             category:'בשר ועוף',       cal:541, protein:37,   carbs:1.4,  fat:42,   unit:'פרוסה',   grams:8   },
  { id:'me19', name:'שוורמה עוף',         category:'בשר ועוף',       cal:220, protein:18,   carbs:15,   fat:9,    unit:'100 גרם', grams:100 },
  { id:'me20', name:'קציצות בשר',         category:'בשר ועוף',       cal:248, protein:15,   carbs:12,   fat:16,   unit:'יחידה',   grams:60  },

  // ─── דגים ופירות ים ───
  { id:'fi01', name:'סלמון',              category:'דגים ופירות ים', cal:208, protein:20,   carbs:0,    fat:13,   unit:'100 גרם', grams:100 },
  { id:'fi02', name:'טונה אדומה',         category:'דגים ופירות ים', cal:144, protein:23,   carbs:0,    fat:5,    unit:'100 גרם', grams:100 },
  { id:'fi03', name:'טונה שימורים בשמן',  category:'דגים ופירות ים', cal:290, protein:27,   carbs:0,    fat:20,   unit:'קופסה',   grams:170 },
  { id:'fi04', name:'טונה שימורים במים',  category:'דגים ופירות ים', cal:116, protein:26,   carbs:0,    fat:0.8,  unit:'קופסה',   grams:170 },
  { id:'fi05', name:'בקלה',               category:'דגים ופירות ים', cal:82,  protein:18,   carbs:0,    fat:0.7,  unit:'100 גרם', grams:100 },
  { id:'fi06', name:'דניס',               category:'דגים ופירות ים', cal:97,  protein:18,   carbs:0,    fat:2,    unit:'100 גרם', grams:100 },
  { id:'fi07', name:'לוקוס',              category:'דגים ופירות ים', cal:97,  protein:20,   carbs:0,    fat:1.5,  unit:'100 גרם', grams:100 },
  { id:'fi08', name:'מוסר ים',            category:'דגים ופירות ים', cal:124, protein:20,   carbs:0,    fat:4.5,  unit:'100 גרם', grams:100 },
  { id:'fi09', name:'שרימפס',             category:'דגים ופירות ים', cal:99,  protein:24,   carbs:0.2,  fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'fi10', name:'סרדינים בשמן',       category:'דגים ופירות ים', cal:208, protein:25,   carbs:0,    fat:11,   unit:'קופסה',   grams:92  },
  { id:'fi11', name:'הרינג',              category:'דגים ופירות ים', cal:158, protein:18,   carbs:0,    fat:9,    unit:'100 גרם', grams:100 },
  { id:'fi12', name:'מקרל',               category:'דגים ופירות ים', cal:205, protein:19,   carbs:0,    fat:13,   unit:'100 גרם', grams:100 },
  { id:'fi13', name:'פורל',               category:'דגים ופירות ים', cal:148, protein:21,   carbs:0,    fat:6.6,  unit:'100 גרם', grams:100 },
  { id:'fi14', name:'אמנון',              category:'דגים ופירות ים', cal:96,  protein:20,   carbs:0,    fat:1.7,  unit:'100 גרם', grams:100 },
  { id:'fi15', name:'קלמרי',              category:'דגים ופירות ים', cal:92,  protein:16,   carbs:3.1,  fat:1.4,  unit:'100 גרם', grams:100 },
  { id:'fi16', name:'תמנון',              category:'דגים ופירות ים', cal:82,  protein:15,   carbs:2.2,  fat:1,    unit:'100 גרם', grams:100 },
  { id:'fi17', name:'קרפיון',             category:'דגים ופירות ים', cal:127, protein:18,   carbs:0,    fat:5.6,  unit:'100 גרם', grams:100 },
  { id:'fi18', name:'אנשובי שימורים',     category:'דגים ופירות ים', cal:210, protein:29,   carbs:0,    fat:10,   unit:'100 גרם', grams:100 },
  { id:'fi19', name:'סושי (2 יחידות)',    category:'דגים ופירות ים', cal:93,  protein:4.3,  carbs:15,   fat:1.6,  unit:'2 יחידות',grams:30  },
  { id:'fi20', name:'צלופח',              category:'דגים ופירות ים', cal:184, protein:18.4, carbs:0,    fat:12,   unit:'100 גרם', grams:100 },

  // ─── מוצרי חלב ───
  { id:'da01', name:'חלב 1%',             category:'מוצרי חלב',      cal:42,  protein:3.4,  carbs:5,    fat:1,    unit:'כוס',     grams:240 },
  { id:'da02', name:'חלב 3%',             category:'מוצרי חלב',      cal:61,  protein:3.2,  carbs:4.8,  fat:3.3,  unit:'כוס',     grams:240 },
  { id:'da03', name:'יוגורט 0%',          category:'מוצרי חלב',      cal:56,  protein:10,   carbs:3.4,  fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'da04', name:'יוגורט 3%',          category:'מוצרי חלב',      cal:60,  protein:5,    carbs:4.7,  fat:3,    unit:'100 גרם', grams:100 },
  { id:'da05', name:'יוגורט יווני',       category:'מוצרי חלב',      cal:97,  protein:9,    carbs:3.6,  fat:5,    unit:'100 גרם', grams:100 },
  { id:'da06', name:'גבינה לבנה 5%',      category:'מוצרי חלב',      cal:77,  protein:11,   carbs:4,    fat:2,    unit:'100 גרם', grams:100 },
  { id:'da07', name:'גבינה לבנה 9%',      category:'מוצרי חלב',      cal:120, protein:9,    carbs:3.5,  fat:7.5,  unit:'100 גרם', grams:100 },
  { id:'da08', name:'קוטג׳',              category:'מוצרי חלב',      cal:98,  protein:11,   carbs:3.4,  fat:4.3,  unit:'100 גרם', grams:100 },
  { id:'da09', name:'בולגרית 5%',         category:'מוצרי חלב',      cal:85,  protein:7,    carbs:3.5,  fat:5,    unit:'100 גרם', grams:100 },
  { id:'da10', name:'גבינה צהובה',        category:'מוצרי חלב',      cal:403, protein:25,   carbs:1.3,  fat:33,   unit:'פרוסה',   grams:28  },
  { id:'da11', name:'מוצרלה',             category:'מוצרי חלב',      cal:300, protein:22,   carbs:2.2,  fat:22,   unit:'100 גרם', grams:100 },
  { id:'da12', name:'פרמזן',              category:'מוצרי חלב',      cal:431, protein:38,   carbs:4,    fat:29,   unit:'כף',      grams:5   },
  { id:'da13', name:'קממבר',              category:'מוצרי חלב',      cal:300, protein:20,   carbs:0.5,  fat:24,   unit:'100 גרם', grams:100 },
  { id:'da14', name:'גאודה',              category:'מוצרי חלב',      cal:356, protein:25,   carbs:2.2,  fat:27,   unit:'100 גרם', grams:100 },
  { id:'da15', name:'גבינה כחולה',        category:'מוצרי חלב',      cal:353, protein:21,   carbs:2.3,  fat:29,   unit:'100 גרם', grams:100 },
  { id:'da16', name:'שמנת חמוצה',         category:'מוצרי חלב',      cal:193, protein:2.5,  carbs:3.5,  fat:19,   unit:'כף',      grams:15  },
  { id:'da17', name:'שמנת לקפה 38%',      category:'מוצרי חלב',      cal:340, protein:2.1,  carbs:2.8,  fat:35,   unit:'כף',      grams:15  },
  { id:'da18', name:'חמאה',               category:'מוצרי חלב',      cal:717, protein:0.9,  carbs:0.1,  fat:81,   unit:'כף',      grams:14  },
  { id:'da19', name:'גלידת וניל',         category:'מוצרי חלב',      cal:207, protein:3.5,  carbs:24,   fat:11,   unit:'100 גרם', grams:100 },
  { id:'da20', name:'שמנת מתוקה',         category:'מוצרי חלב',      cal:340, protein:2,    carbs:3,    fat:36,   unit:'100 גרם', grams:100 },

  // ─── ביצים ───
  { id:'eg01', name:'ביצה שלמה',          category:'ביצים',          cal:155, protein:13,   carbs:1.1,  fat:11,   unit:'יחידה',   grams:60  },
  { id:'eg02', name:'חלבון ביצה',         category:'ביצים',          cal:52,  protein:11,   carbs:0.7,  fat:0.2,  unit:'יחידה',   grams:33  },
  { id:'eg03', name:'חלמון ביצה',         category:'ביצים',          cal:322, protein:16,   carbs:3.6,  fat:27,   unit:'יחידה',   grams:17  },

  // ─── אגוזים וזרעים ───
  { id:'nu01', name:'אגוזי מלך',          category:'אגוזים וזרעים',  cal:654, protein:15,   carbs:14,   fat:65,   unit:'30 גרם',  grams:30  },
  { id:'nu02', name:'שקדים',              category:'אגוזים וזרעים',  cal:579, protein:21,   carbs:22,   fat:50,   unit:'30 גרם',  grams:30  },
  { id:'nu03', name:'בוטנים',             category:'אגוזים וזרעים',  cal:567, protein:26,   carbs:16,   fat:49,   unit:'30 גרם',  grams:30  },
  { id:'nu04', name:'קשיו',               category:'אגוזים וזרעים',  cal:553, protein:18,   carbs:30,   fat:44,   unit:'30 גרם',  grams:30  },
  { id:'nu05', name:'אגוז ברזיל',         category:'אגוזים וזרעים',  cal:659, protein:14,   carbs:12,   fat:67,   unit:'יחידה',   grams:5   },
  { id:'nu06', name:'פיסטוק',             category:'אגוזים וזרעים',  cal:562, protein:20,   carbs:28,   fat:45,   unit:'30 גרם',  grams:30  },
  { id:'nu07', name:'פקאן',               category:'אגוזים וזרעים',  cal:691, protein:9,    carbs:14,   fat:72,   unit:'30 גרם',  grams:30  },
  { id:'nu08', name:'אגוזי לוז',          category:'אגוזים וזרעים',  cal:628, protein:15,   carbs:17,   fat:61,   unit:'30 גרם',  grams:30  },
  { id:'nu09', name:'זרעי צ׳יה',          category:'אגוזים וזרעים',  cal:486, protein:17,   carbs:42,   fat:31,   unit:'כף',      grams:12  },
  { id:'nu10', name:'זרעי פשתן',          category:'אגוזים וזרעים',  cal:534, protein:18,   carbs:29,   fat:42,   unit:'כף',      grams:10  },
  { id:'nu11', name:'זרעי דלעת',          category:'אגוזים וזרעים',  cal:559, protein:30,   carbs:11,   fat:49,   unit:'30 גרם',  grams:30  },
  { id:'nu12', name:'זרעי חמניות',        category:'אגוזים וזרעים',  cal:584, protein:21,   carbs:20,   fat:51,   unit:'30 גרם',  grams:30  },
  { id:'nu13', name:'שומשום',             category:'אגוזים וזרעים',  cal:573, protein:17,   carbs:23,   fat:50,   unit:'כף',      grams:9   },
  { id:'nu14', name:'חמאת בוטנים',        category:'אגוזים וזרעים',  cal:588, protein:25,   carbs:20,   fat:50,   unit:'כף',      grams:16  },
  { id:'nu15', name:'טחינה גולמית',       category:'אגוזים וזרעים',  cal:595, protein:17,   carbs:21,   fat:53,   unit:'כף',      grams:15  },

  // ─── שמנים ושומנים ───
  { id:'oi01', name:'שמן זית',            category:'שמנים ושומנים',  cal:884, protein:0,    carbs:0,    fat:100,  unit:'כף',      grams:14  },
  { id:'oi02', name:'שמן קנולה',          category:'שמנים ושומנים',  cal:884, protein:0,    carbs:0,    fat:100,  unit:'כף',      grams:14  },
  { id:'oi03', name:'שמן חמניות',         category:'שמנים ושומנים',  cal:884, protein:0,    carbs:0,    fat:100,  unit:'כף',      grams:14  },
  { id:'oi04', name:'שמן קוקוס',          category:'שמנים ושומנים',  cal:862, protein:0,    carbs:0,    fat:100,  unit:'כף',      grams:14  },
  { id:'oi05', name:'מרגרינה',            category:'שמנים ושומנים',  cal:718, protein:0.2,  carbs:0.7,  fat:80,   unit:'כף',      grams:14  },
  { id:'oi06', name:'מיונז',              category:'שמנים ושומנים',  cal:680, protein:1,    carbs:0.6,  fat:75,   unit:'כף',      grams:14  },

  // ─── ממתקים וחטיפים ───
  { id:'sw01', name:'שוקולד מריר 70%',    category:'ממתקים וחטיפים', cal:598, protein:8,    carbs:46,   fat:43,   unit:'100 גרם', grams:100 },
  { id:'sw02', name:'שוקולד חלב',         category:'ממתקים וחטיפים', cal:535, protein:8,    carbs:59,   fat:30,   unit:'100 גרם', grams:100 },
  { id:'sw03', name:'שוקולד לבן',         category:'ממתקים וחטיפים', cal:539, protein:6,    carbs:59,   fat:32,   unit:'100 גרם', grams:100 },
  { id:'sw04', name:'עוגיות',             category:'ממתקים וחטיפים', cal:480, protein:6,    carbs:68,   fat:22,   unit:'יחידה',   grams:20  },
  { id:'sw05', name:'בייגלה',             category:'ממתקים וחטיפים', cal:367, protein:9,    carbs:78,   fat:1.5,  unit:'100 גרם', grams:100 },
  { id:'sw06', name:'ביסלי גריל',         category:'ממתקים וחטיפים', cal:442, protein:9,    carbs:62,   fat:18,   unit:'100 גרם', grams:100 },
  { id:'sw07', name:'צ׳יפס תפו׳א',        category:'ממתקים וחטיפים', cal:536, protein:7,    carbs:53,   fat:35,   unit:'100 גרם', grams:100 },
  { id:'sw08', name:'פופקורן',            category:'ממתקים וחטיפים', cal:375, protein:11,   carbs:74,   fat:4.5,  unit:'100 גרם', grams:100 },
  { id:'sw09', name:'חטיף תירס',          category:'ממתקים וחטיפים', cal:366, protein:4,    carbs:77,   fat:4,    unit:'100 גרם', grams:100 },
  { id:'sw10', name:'דבש',                category:'ממתקים וחטיפים', cal:304, protein:0.3,  carbs:82,   fat:0,    unit:'כף',      grams:21  },
  { id:'sw11', name:'ריבה',               category:'ממתקים וחטיפים', cal:278, protein:0.4,  carbs:69,   fat:0.1,  unit:'כף',      grams:20  },
  { id:'sw12', name:'סוכר לבן',           category:'ממתקים וחטיפים', cal:387, protein:0,    carbs:100,  fat:0,    unit:'כפית',    grams:4   },
  { id:'sw13', name:'עוגת שוקולד',        category:'ממתקים וחטיפים', cal:371, protein:5,    carbs:50,   fat:18,   unit:'פרוסה',   grams:80  },
  { id:'sw14', name:'מאפין',              category:'ממתקים וחטיפים', cal:377, protein:6.5,  carbs:50,   fat:18,   unit:'יחידה',   grams:113 },
  { id:'sw15', name:'קרואסון',            category:'ממתקים וחטיפים', cal:406, protein:8.3,  carbs:46,   fat:21,   unit:'יחידה',   grams:57  },
  { id:'sw16', name:'דונאט',              category:'ממתקים וחטיפים', cal:452, protein:7,    carbs:51,   fat:25,   unit:'יחידה',   grams:60  },
  { id:'sw17', name:'גליל ׳שוקי׳',        category:'ממתקים וחטיפים', cal:498, protein:7.5,  carbs:62,   fat:24,   unit:'יחידה',   grams:50  },
  { id:'sw18', name:'חלבה',               category:'ממתקים וחטיפים', cal:523, protein:14,   carbs:57,   fat:29,   unit:'100 גרם', grams:100 },
  { id:'sw19', name:'לוקום',              category:'ממתקים וחטיפים', cal:322, protein:0.4,  carbs:80,   fat:0.1,  unit:'יחידה',   grams:13  },
  { id:'sw20', name:'ארטיק (ממוצע)',      category:'ממתקים וחטיפים', cal:140, protein:2,    carbs:22,   fat:5,    unit:'יחידה',   grams:75  },

  // ─── משקאות ───
  { id:'bv01', name:'מים',                category:'משקאות',         cal:0,   protein:0,    carbs:0,    fat:0,    unit:'כוס',     grams:240 },
  { id:'bv02', name:'קפה שחור',           category:'משקאות',         cal:2,   protein:0.3,  carbs:0,    fat:0,    unit:'כוס',     grams:240 },
  { id:'bv03', name:'אספרסו',             category:'משקאות',         cal:9,   protein:0.6,  carbs:1.6,  fat:0.2,  unit:'שוט',     grams:30  },
  { id:'bv04', name:'לאטה',               category:'משקאות',         cal:90,  protein:4.5,  carbs:9,    fat:3.5,  unit:'כוס',     grams:360 },
  { id:'bv05', name:'קפוצ׳ינו',           category:'משקאות',         cal:74,  protein:4.2,  carbs:5.5,  fat:3.4,  unit:'כוס',     grams:240 },
  { id:'bv06', name:'אמריקנו',            category:'משקאות',         cal:15,  protein:0.5,  carbs:2,    fat:0.2,  unit:'כוס',     grams:300 },
  { id:'bv07', name:'קפה עם חלב',         category:'משקאות',         cal:40,  protein:2,    carbs:3,    fat:2,    unit:'כוס',     grams:240 },
  { id:'bv08', name:'תה שחור',            category:'משקאות',         cal:1,   protein:0,    carbs:0.2,  fat:0,    unit:'כוס',     grams:240 },
  { id:'bv09', name:'תה ירוק',            category:'משקאות',         cal:2,   protein:0,    carbs:0.4,  fat:0,    unit:'כוס',     grams:240 },
  { id:'bv10', name:'תה נענע',            category:'משקאות',         cal:2,   protein:0,    carbs:0.3,  fat:0,    unit:'כוס',     grams:240 },
  { id:'bv11', name:'מיץ תפוזים טבעי',   category:'משקאות',         cal:45,  protein:0.7,  carbs:10,   fat:0.2,  unit:'כוס',     grams:240 },
  { id:'bv12', name:'מיץ תפוזים מסחרי',  category:'משקאות',         cal:42,  protein:0.7,  carbs:10,   fat:0.1,  unit:'כוס',     grams:240 },
  { id:'bv13', name:'מיץ תפוחים',        category:'משקאות',         cal:46,  protein:0.1,  carbs:11,   fat:0.1,  unit:'כוס',     grams:240 },
  { id:'bv14', name:'מיץ ענבים',         category:'משקאות',         cal:60,  protein:0.5,  carbs:15,   fat:0.1,  unit:'כוס',     grams:240 },
  { id:'bv15', name:'קולה',               category:'משקאות',         cal:41,  protein:0,    carbs:10.6, fat:0,    unit:'פחית',    grams:355 },
  { id:'bv16', name:'קולה דיאט',          category:'משקאות',         cal:0,   protein:0.1,  carbs:0,    fat:0,    unit:'פחית',    grams:355 },
  { id:'bv17', name:'ספרייט',             category:'משקאות',         cal:41,  protein:0,    carbs:10.6, fat:0,    unit:'פחית',    grams:355 },
  { id:'bv18', name:'מים מוגזים',         category:'משקאות',         cal:0,   protein:0,    carbs:0,    fat:0,    unit:'בקבוק',   grams:500 },
  { id:'bv19', name:'בירה',               category:'משקאות',         cal:43,  protein:0.5,  carbs:3.6,  fat:0,    unit:'פחית',    grams:355 },
  { id:'bv20', name:'יין אדום',           category:'משקאות',         cal:85,  protein:0.1,  carbs:2.7,  fat:0,    unit:'כוס',     grams:150 },
  { id:'bv21', name:'יין לבן',            category:'משקאות',         cal:82,  protein:0.1,  carbs:2.6,  fat:0,    unit:'כוס',     grams:150 },
  { id:'bv22', name:'שוקו חם',            category:'משקאות',         cal:83,  protein:3.5,  carbs:11,   fat:3,    unit:'כוס',     grams:240 },
  { id:'bv23', name:'משקה אנרגיה',        category:'משקאות',         cal:45,  protein:0,    carbs:11,   fat:0,    unit:'פחית',    grams:250 },
  { id:'bv24', name:'חלב סויה',           category:'משקאות',         cal:54,  protein:3.3,  carbs:6.3,  fat:1.8,  unit:'כוס',     grams:240 },
  { id:'bv25', name:'חלב שקדים',          category:'משקאות',         cal:17,  protein:0.6,  carbs:1.4,  fat:1.1,  unit:'כוס',     grams:240 },
  { id:'bv26', name:'חלב קוקוס (שתייה)',  category:'משקאות',         cal:45,  protein:0.5,  carbs:6.5,  fat:2,    unit:'כוס',     grams:240 },
  { id:'bv27', name:'שייק חלבון',         category:'משקאות',         cal:120, protein:25,   carbs:4,    fat:1.5,  unit:'מנה',     grams:30  },
  { id:'bv28', name:'וודקה',              category:'משקאות',         cal:231, protein:0,    carbs:0,    fat:0,    unit:'שוט',     grams:44  },
  { id:'bv29', name:'ויסקי',              category:'משקאות',         cal:250, protein:0,    carbs:0,    fat:0,    unit:'שוט',     grams:44  },
  { id:'bv30', name:'מיץ עגבניות',        category:'משקאות',         cal:17,  protein:0.8,  carbs:3.5,  fat:0.2,  unit:'כוס',     grams:240 },
  { id:'bv31', name:'קפה קר',             category:'משקאות',         cal:35,  protein:1,    carbs:7,    fat:0,    unit:'כוס',     grams:240 },
  { id:'bv32', name:'תה קמומיל',          category:'משקאות',         cal:1,   protein:0,    carbs:0.2,  fat:0,    unit:'כוס',     grams:240 },

  // ─── מאכלים ישראליים ───
  { id:'il01', name:'שקשוקה',             category:'מאכלים ישראליים',cal:155, protein:9.5,  carbs:8,    fat:9,    unit:'מנה',     grams:250 },
  { id:'il02', name:'פלאפל כדור',         category:'מאכלים ישראליים',cal:180, protein:7,    carbs:20,   fat:9,    unit:'כדור',    grams:30  },
  { id:'il03', name:'בורקס גבינה',        category:'מאכלים ישראליים',cal:310, protein:8,    carbs:32,   fat:17,   unit:'יחידה',   grams:80  },
  { id:'il04', name:'בורקס תפו׳א',        category:'מאכלים ישראליים',cal:280, protein:6,    carbs:36,   fat:13,   unit:'יחידה',   grams:80  },
  { id:'il05', name:'מרק עוף',            category:'מאכלים ישראליים',cal:80,  protein:6,    carbs:8,    fat:2.5,  unit:'צלחת',    grams:350 },
  { id:'il06', name:'חומוס עם שמן',       category:'מאכלים ישראליים',cal:330, protein:14,   carbs:38,   fat:14,   unit:'מנה',     grams:200 },
  { id:'il07', name:'קציצה',              category:'מאכלים ישראליים',cal:248, protein:15,   carbs:12,   fat:16,   unit:'יחידה',   grams:60  },
  { id:'il08', name:'סביח',               category:'מאכלים ישראליים',cal:410, protein:18,   carbs:45,   fat:18,   unit:'מנה',     grams:300 },
  { id:'il09', name:'שוורמה בפיתה',       category:'מאכלים ישראליים',cal:450, protein:28,   carbs:44,   fat:18,   unit:'מנה',     grams:280 },
  { id:'il10', name:'קציצות דג (ג׳חנון)',  category:'מאכלים ישראליים',cal:290, protein:14,   carbs:28,   fat:13,   unit:'יחידה',   grams:100 },

  // ─── רטבים ותיבול ───
  { id:'sa01', name:'קטשופ',              category:'רטבים ותיבול',   cal:101, protein:1.9,  carbs:27,   fat:0.1,  unit:'כף',      grams:17  },
  { id:'sa02', name:'חרדל',               category:'רטבים ותיבול',   cal:66,  protein:4.4,  carbs:5.8,  fat:3.3,  unit:'כף',      grams:15  },
  { id:'sa03', name:'רוטב סויה',          category:'רטבים ותיבול',   cal:53,  protein:8,    carbs:4.9,  fat:0.6,  unit:'כף',      grams:16  },
  { id:'sa04', name:'חריף סרירצ׳ה',       category:'רטבים ותיבול',   cal:96,  protein:2.7,  carbs:18,   fat:1.8,  unit:'כף',      grams:15  },
  { id:'sa05', name:'פסטו',               category:'רטבים ותיבול',   cal:263, protein:5,    carbs:7,    fat:24,   unit:'כף',      grams:20  },
  { id:'sa06', name:'רוטב עגבניות',       category:'רטבים ותיבול',   cal:57,  protein:2,    carbs:12,   fat:0.5,  unit:'100 גרם', grams:100 },
  { id:'sa07', name:'גואקמולה',           category:'רטבים ותיבול',   cal:152, protein:2,    carbs:8.5,  fat:13,   unit:'100 גרם', grams:100 },
  { id:'sa08', name:'צזיקי',              category:'רטבים ותיבול',   cal:72,  protein:4,    carbs:4,    fat:4.5,  unit:'100 גרם', grams:100 },
  { id:'sa09', name:'סלסה',               category:'רטבים ותיבול',   cal:36,  protein:1.5,  carbs:7.7,  fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'sa10', name:'טחינה מדוללת',       category:'רטבים ותיבול',   cal:325, protein:9.5,  carbs:12,   fat:29,   unit:'כף',      grams:15  },
  { id:'sa11', name:'חומוס מרקחה',        category:'רטבים ותיבול',   cal:195, protein:9,    carbs:16,   fat:11,   unit:'כף',      grams:30  },
  { id:'sa12', name:'רוטב עיסת בשר',      category:'רטבים ותיבול',   cal:152, protein:8,    carbs:9,    fat:10,   unit:'100 גרם', grams:100 },

  // ─── תוספי ספורט ───
  { id:'sp01', name:'אבקת חלבון מי גבינה',category:'תוספי ספורט',   cal:120, protein:24,   carbs:3,    fat:2,    unit:'מנה',     grams:30  },
  { id:'sp02', name:'BCAA',               category:'תוספי ספורט',   cal:20,  protein:5,    carbs:0,    fat:0,    unit:'כף',      grams:5   },
  { id:'sp03', name:'קריאטין',            category:'תוספי ספורט',   cal:0,   protein:0,    carbs:0,    fat:0,    unit:'כפית',    grams:5   },
  { id:'sp04', name:'גיינר',              category:'תוספי ספורט',   cal:380, protein:26,   carbs:60,   fat:3,    unit:'מנה',     grams:100 },
  { id:'sp05', name:'חטיף חלבון',         category:'תוספי ספורט',   cal:200, protein:20,   carbs:23,   fat:5,    unit:'יחידה',   grams:60  },

  // ─── מנות בינלאומיות ───
  { id:'in01', name:'פיצה מרגריטה',       category:'מנות בינלאומיות',cal:266, protein:11,   carbs:33,   fat:10,   unit:'פרוסה',   grams:107 },
  { id:'in02', name:'פיצה פסטה',          category:'מנות בינלאומיות',cal:270, protein:12,   carbs:32,   fat:11,   unit:'פרוסה',   grams:107 },
  { id:'in03', name:'פסטה בולונז',         category:'מנות בינלאומיות',cal:180, protein:10,   carbs:22,   fat:6,    unit:'100 גרם', grams:100 },
  { id:'in04', name:'פסטה קרבונרה',        category:'מנות בינלאומיות',cal:320, protein:14,   carbs:38,   fat:13,   unit:'100 גרם', grams:100 },
  { id:'in05', name:'ריזוטו',             category:'מנות בינלאומיות',cal:166, protein:4.4,  carbs:22,   fat:6.5,  unit:'100 גרם', grams:100 },
  { id:'in06', name:'לזניה',              category:'מנות בינלאומיות',cal:135, protein:8,    carbs:11,   fat:6.2,  unit:'100 גרם', grams:100 },
  { id:'in07', name:'סושי רול (8 יח׳)',   category:'מנות בינלאומיות',cal:350, protein:13,   carbs:60,   fat:5,    unit:'מנה',     grams:200 },
  { id:'in08', name:'ראמן',               category:'מנות בינלאומיות',cal:436, protein:21,   carbs:54,   fat:14,   unit:'מנה',     grams:500 },
  { id:'in09', name:'פד תאי',             category:'מנות בינלאומיות',cal:181, protein:8.4,  carbs:26,   fat:5,    unit:'100 גרם', grams:100 },
  { id:'in10', name:'קארי עוף תאילנדי',   category:'מנות בינלאומיות',cal:150, protein:11,   carbs:8,    fat:8,    unit:'100 גרם', grams:100 },
  { id:'in11', name:'ביריאני אורז',        category:'מנות בינלאומיות',cal:180, protein:7,    carbs:28,   fat:5,    unit:'100 גרם', grams:100 },
  { id:'in12', name:'פלאפל בפיתה + תוספות',category:'מנות בינלאומיות',cal:480, protein:14,  carbs:60,   fat:20,   unit:'מנה',     grams:300 },
  { id:'in13', name:'בורגר המבורגר מלא',  category:'מנות בינלאומיות',cal:550, protein:28,   carbs:44,   fat:28,   unit:'מנה',     grams:220 },
  { id:'in14', name:'טאקו עוף',           category:'מנות בינלאומיות',cal:213, protein:14,   carbs:21,   fat:8,    unit:'יחידה',   grams:100 },
  { id:'in15', name:'ספרינג רול מטוגן',   category:'מנות בינלאומיות',cal:148, protein:4,    carbs:17,   fat:7,    unit:'יחידה',   grams:60  },
  { id:'in16', name:'ג׳ירוס בפיתה',       category:'מנות בינלאומיות',cal:430, protein:22,   carbs:44,   fat:18,   unit:'מנה',     grams:280 },
  { id:'in17', name:'מוסקה',              category:'מנות בינלאומיות',cal:160, protein:8,    carbs:10,   fat:10,   unit:'100 גרם', grams:100 },
  { id:'in18', name:'פאיה',               category:'מנות בינלאומיות',cal:170, protein:11,   carbs:22,   fat:4,    unit:'100 גרם', grams:100 },
  { id:'in19', name:'קרפ',                category:'מנות בינלאומיות',cal:227, protein:5.9,  carbs:30,   fat:9.7,  unit:'יחידה',   grams:90  },
  { id:'in20', name:'נאן',                category:'מנות בינלאומיות',cal:317, protein:9,    carbs:55,   fat:6,    unit:'יחידה',   grams:90  },

  // ─── מזון מהיר ───
  { id:'ff01', name:'צ׳יפס מקדונלדס (M)',  category:'מזון מהיר',      cal:320, protein:3.8,  carbs:43,   fat:15,   unit:'מנה',     grams:117 },
  { id:'ff02', name:'מק רויאל',           category:'מזון מהיר',      cal:490, protein:27,   carbs:42,   fat:24,   unit:'יחידה',   grams:200 },
  { id:'ff03', name:'ביג מק',             category:'מזון מהיר',      cal:563, protein:26,   carbs:45,   fat:33,   unit:'יחידה',   grams:219 },
  { id:'ff04', name:'קנאפה מהירה',        category:'מזון מהיר',      cal:380, protein:7,    carbs:52,   fat:17,   unit:'100 גרם', grams:100 },
  { id:'ff05', name:'כנפיים מטוגנות KFC', category:'מזון מהיר',      cal:294, protein:27,   carbs:8,    fat:18,   unit:'2 כנפיים',grams:120 },
  { id:'ff06', name:'שניצל מטוגן',        category:'מזון מהיר',      cal:280, protein:20,   carbs:17,   fat:14,   unit:'100 גרם', grams:100 },
  { id:'ff07', name:'פיש וצ׳יפס',         category:'מזון מהיר',      cal:271, protein:11,   carbs:25,   fat:14,   unit:'100 גרם', grams:100 },
  { id:'ff08', name:'נאגטס עוף (6 יח׳)',  category:'מזון מהיר',      cal:280, protein:15,   carbs:18,   fat:17,   unit:'מנה',     grams:100 },
  { id:'ff09', name:'הוט דוג',            category:'מזון מהיר',      cal:290, protein:10,   carbs:28,   fat:16,   unit:'יחידה',   grams:100 },
  { id:'ff10', name:'שווארמה מלאה',       category:'מזון מהיר',      cal:650, protein:38,   carbs:56,   fat:28,   unit:'מנה',     grams:350 },

  // ─── ארוחות בית ───
  { id:'hm01', name:'אורז עם עוף',        category:'ארוחות בית',     cal:195, protein:16,   carbs:22,   fat:4,    unit:'100 גרם', grams:100 },
  { id:'hm02', name:'פסטה עם רוטב עגבניות',category:'ארוחות בית',   cal:160, protein:6,    carbs:28,   fat:3,    unit:'100 גרם', grams:100 },
  { id:'hm03', name:'מג׳דרה',             category:'ארוחות בית',     cal:150, protein:6,    carbs:26,   fat:3,    unit:'100 גרם', grams:100 },
  { id:'hm04', name:'עוף בתנור עם ירקות', category:'ארוחות בית',     cal:180, protein:22,   carbs:8,    fat:7,    unit:'100 גרם', grams:100 },
  { id:'hm05', name:'דג בתנור עם לימון',  category:'ארוחות בית',     cal:130, protein:20,   carbs:2,    fat:5,    unit:'100 גרם', grams:100 },
  { id:'hm06', name:'מרק עדשים',          category:'ארוחות בית',     cal:95,  protein:5,    carbs:15,   fat:2,    unit:'צלחת',    grams:350 },
  { id:'hm07', name:'מרק עגבניות',        category:'ארוחות בית',     cal:60,  protein:2,    carbs:10,   fat:1.5,  unit:'צלחת',    grams:350 },
  { id:'hm08', name:'ביצים מקושקשות',     category:'ארוחות בית',     cal:148, protein:10,   carbs:1.2,  fat:11,   unit:'מנה (2)', grams:100 },
  { id:'hm09', name:'חביתה עם ירקות',     category:'ארוחות בית',     cal:165, protein:11,   carbs:4,    fat:12,   unit:'מנה',     grams:150 },
  { id:'hm10', name:'אורז עדשות ובצל',    category:'ארוחות בית',     cal:165, protein:7,    carbs:28,   fat:4,    unit:'100 גרם', grams:100 },
  { id:'hm11', name:'תבשיל בקר עם ירקות', category:'ארוחות בית',     cal:190, protein:18,   carbs:10,   fat:9,    unit:'100 גרם', grams:100 },
  { id:'hm12', name:'גרנולה עם יוגורט',   category:'ארוחות בית',     cal:310, protein:10,   carbs:42,   fat:11,   unit:'מנה',     grams:200 },
  { id:'hm13', name:'שיבולת שועל עם חלב', category:'ארוחות בית',     cal:170, protein:7,    carbs:27,   fat:4,    unit:'מנה',     grams:250 },
  { id:'hm14', name:'טוסט עם גבינה',      category:'ארוחות בית',     cal:250, protein:12,   carbs:28,   fat:10,   unit:'יחידה',   grams:120 },
  { id:'hm15', name:'סלט ירקות עם שמן זית',category:'ארוחות בית',   cal:95,  protein:2,    carbs:8,    fat:7,    unit:'מנה',     grams:200 },

  // ─── מוצרי אפייה ───
  { id:'bk01', name:'לחם בננה',           category:'מוצרי אפייה',    cal:325, protein:5,    carbs:55,   fat:9,    unit:'פרוסה',   grams:60  },
  { id:'bk02', name:'עוגיות שוקולד צ׳יפס',category:'מוצרי אפייה',   cal:488, protein:5.8,  carbs:64,   fat:24,   unit:'יחידה',   grams:25  },
  { id:'bk03', name:'בראוניז',            category:'מוצרי אפייה',    cal:466, protein:6,    carbs:57,   fat:25,   unit:'יחידה',   grams:60  },
  { id:'bk04', name:'עוגת גבינה',         category:'מוצרי אפייה',    cal:321, protein:6,    carbs:26,   fat:22,   unit:'פרוסה',   grams:80  },
  { id:'bk05', name:'עוגת דבש (לקח)',     category:'מוצרי אפייה',    cal:356, protein:5,    carbs:63,   fat:9,    unit:'פרוסה',   grams:60  },
  { id:'bk06', name:'חלה',                category:'מוצרי אפייה',    cal:272, protein:8.4,  carbs:51,   fat:3.6,  unit:'פרוסה',   grams:35  },
  { id:'bk07', name:'בייגל',              category:'מוצרי אפייה',    cal:270, protein:10,   carbs:53,   fat:1.5,  unit:'יחידה',   grams:105 },
  { id:'bk08', name:'מאפה בוקר',          category:'מוצרי אפייה',    cal:310, protein:7,    carbs:45,   fat:12,   unit:'יחידה',   grams:90  },
  { id:'bk09', name:'רוגלך',              category:'מוצרי אפייה',    cal:440, protein:7,    carbs:54,   fat:22,   unit:'יחידה',   grams:40  },
  { id:'bk10', name:'עוגת שמרים',         category:'מוצרי אפייה',    cal:340, protein:7.5,  carbs:55,   fat:10,   unit:'פרוסה',   grams:70  },

  // ─── גבינות נוספות ───
  { id:'ch01', name:'ריקוטה',             category:'מוצרי חלב',      cal:174, protein:11,   carbs:3,    fat:13,   unit:'100 גרם', grams:100 },
  { id:'ch02', name:'ברי',                category:'מוצרי חלב',      cal:334, protein:21,   carbs:0.5,  fat:28,   unit:'100 גרם', grams:100 },
  { id:'ch03', name:'פטה',                category:'מוצרי חלב',      cal:264, protein:14,   carbs:4,    fat:21,   unit:'100 גרם', grams:100 },
  { id:'ch04', name:'צ׳דר',              category:'מוצרי חלב',      cal:403, protein:25,   carbs:1.3,  fat:33,   unit:'100 גרם', grams:100 },
  { id:'ch05', name:'אמנטל',              category:'מוצרי חלב',      cal:380, protein:28,   carbs:1.5,  fat:29,   unit:'100 גרם', grams:100 },

  // ─── ירקות נוספים ───
  { id:'vx01', name:'ברוקולי רב',         category:'ירקות',          cal:25,  protein:2.1,  carbs:4.3,  fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'vx02', name:'קייל',               category:'ירקות',          cal:49,  protein:4.3,  carbs:9,    fat:0.9,  unit:'100 גרם', grams:100 },
  { id:'vx03', name:'נבטי ברוקולי',       category:'ירקות',          cal:35,  protein:2.4,  carbs:5.7,  fat:0.4,  unit:'100 גרם', grams:100 },
  { id:'vx04', name:'אדמאמה',             category:'ירקות',          cal:122, protein:11,   carbs:9,    fat:5,    unit:'100 גרם', grams:100 },
  { id:'vx05', name:'דלעת',               category:'ירקות',          cal:26,  protein:1,    carbs:6.5,  fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'vx06', name:'פלפל צ׳ילי',         category:'ירקות',          cal:40,  protein:1.9,  carbs:8.8,  fat:0.4,  unit:'יחידה',   grams:45  },
  { id:'vx07', name:'ג׳ינג׳ר טרי',        category:'ירקות',          cal:80,  protein:1.8,  carbs:18,   fat:0.8,  unit:'כף',      grams:6   },
  { id:'vx08', name:'עלי בזיל',           category:'ירקות',          cal:23,  protein:3.2,  carbs:2.7,  fat:0.6,  unit:'100 גרם', grams:100 },
  { id:'vx09', name:'כרוב ניצנים',        category:'ירקות',          cal:43,  protein:3.4,  carbs:9,    fat:0.3,  unit:'100 גרם', grams:100 },
  { id:'vx10', name:'פטריות שיטאקי',      category:'ירקות',          cal:34,  protein:2.2,  carbs:7,    fat:0.5,  unit:'100 גרם', grams:100 },

  // ─── פירות נוספים ───
  { id:'fx01', name:'אוכמניות יבשות',     category:'פירות',          cal:317, protein:0.5,  carbs:83,   fat:1,    unit:'כף',      grams:10  },
  { id:'fx02', name:'תמרים מג׳הול',       category:'פירות',          cal:277, protein:1.8,  carbs:75,   fat:0.2,  unit:'יחידה',   grams:24  },
  { id:'fx03', name:'גרגרי חמוציות',      category:'פירות',          cal:46,  protein:0.4,  carbs:12,   fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'fx04', name:'פרי יוגי',           category:'פירות',          cal:64,  protein:0.7,  carbs:16,   fat:0.2,  unit:'יחידה',   grams:200 },
  { id:'fx05', name:'שסק',                category:'פירות',          cal:47,  protein:0.4,  carbs:12,   fat:0.2,  unit:'יחידה',   grams:80  },

  // ─── משקאות נוספים ───
  { id:'bx01', name:'קפה סויה לאטה',      category:'משקאות',         cal:80,  protein:4,    carbs:10,   fat:2,    unit:'כוס',     grams:360 },
  { id:'bx02', name:'מאצ׳ה לאטה',         category:'משקאות',         cal:88,  protein:3.5,  carbs:13,   fat:2.5,  unit:'כוס',     grams:360 },
  { id:'bx03', name:'שייק בננה וחלב',     category:'משקאות',         cal:160, protein:6,    carbs:28,   fat:2.5,  unit:'כוס',     grams:300 },
  { id:'bx04', name:'מיץ סלק וגזר',       category:'משקאות',         cal:48,  protein:1.2,  carbs:11,   fat:0.2,  unit:'כוס',     grams:240 },
  { id:'bx05', name:'קומבוצ׳ה',           category:'משקאות',         cal:30,  protein:0,    carbs:7,    fat:0,    unit:'בקבוק',   grams:330 },
  { id:'bx06', name:'מים עם לימון',        category:'משקאות',         cal:5,   protein:0,    carbs:1.2,  fat:0,    unit:'כוס',     grams:240 },
  { id:'bx07', name:'קפה דלגונה',         category:'משקאות',         cal:120, protein:3,    carbs:20,   fat:3.5,  unit:'כוס',     grams:300 },
  { id:'bx08', name:'חלב שיבולת שועל',    category:'משקאות',         cal:50,  protein:1,    carbs:9,    fat:1.5,  unit:'כוס',     grams:240 },
  { id:'bx09', name:'רד בול',             category:'משקאות',         cal:45,  protein:0,    carbs:11,   fat:0,    unit:'פחית',    grams:250 },
  { id:'bx10', name:'ספורטדה',            category:'משקאות',         cal:24,  protein:0,    carbs:6,    fat:0,    unit:'בקבוק',   grams:500 },
  { id:'bx11', name:'שייק תות וחלב',      category:'משקאות',         cal:145, protein:5,    carbs:26,   fat:2,    unit:'כוס',     grams:300 },
  { id:'bx12', name:'מיץ אנרגיה טבעי',   category:'משקאות',         cal:55,  protein:0.8,  carbs:13,   fat:0.1,  unit:'כוס',     grams:240 },
  { id:'bx13', name:'קפה קר עם חלב',      category:'משקאות',         cal:70,  protein:3,    carbs:10,   fat:2,    unit:'כוס',     grams:300 },
  { id:'bx14', name:'תה זנגביל ולימון',   category:'משקאות',         cal:10,  protein:0,    carbs:2.5,  fat:0,    unit:'כוס',     grams:240 },
  { id:'bx15', name:'מיץ ירוק (ספירולינה)',category:'משקאות',        cal:65,  protein:2,    carbs:12,   fat:0.5,  unit:'כוס',     grams:300 },

  // ─── קינוחים ודסרטים ───
  { id:'ds01', name:'טירמיסו',             category:'קינוחים ודסרטים', cal:450, protein:7,    carbs:45,   fat:27,   unit:'מנה',     grams:120 },
  { id:'ds02', name:'פנה קוטה',            category:'קינוחים ודסרטים', cal:280, protein:4,    carbs:30,   fat:16,   unit:'מנה',     grams:120 },
  { id:'ds03', name:'מוס שוקולד',          category:'קינוחים ודסרטים', cal:330, protein:5,    carbs:28,   fat:22,   unit:'מנה',     grams:100 },
  { id:'ds04', name:'קרם ברולה',           category:'קינוחים ודסרטים', cal:340, protein:5,    carbs:32,   fat:21,   unit:'מנה',     grams:120 },
  { id:'ds05', name:'סופגנייה',            category:'קינוחים ודסרטים', cal:320, protein:5,    carbs:42,   fat:15,   unit:'יחידה',   grams:80  },
  { id:'ds06', name:'בקלווה',              category:'קינוחים ודסרטים', cal:528, protein:6,    carbs:63,   fat:29,   unit:'יחידה',   grams:60  },
  { id:'ds07', name:'קנאפה',               category:'קינוחים ודסרטים', cal:380, protein:8,    carbs:52,   fat:17,   unit:'100 גרם', grams:100 },
  { id:'ds08', name:'אורז בחלב',           category:'קינוחים ודסרטים', cal:150, protein:4,    carbs:25,   fat:3.5,  unit:'100 גרם', grams:100 },
  { id:'ds09', name:'פודינג שוקולד',       category:'קינוחים ודסרטים', cal:180, protein:4,    carbs:30,   fat:5.5,  unit:'יחידה',   grams:100 },
  { id:'ds10', name:'אקלר שוקולד',         category:'קינוחים ודסרטים', cal:380, protein:6,    carbs:40,   fat:21,   unit:'יחידה',   grams:90  },
  { id:'ds11', name:'שטרודל תפוחים',       category:'קינוחים ודסרטים', cal:260, protein:3.5,  carbs:40,   fat:10,   unit:'פרוסה',   grams:80  },
  { id:'ds12', name:'מאקרון',              category:'קינוחים ודסרטים', cal:400, protein:5,    carbs:60,   fat:17,   unit:'יחידה',   grams:45  },
  { id:'ds13', name:'גלידת שוקולד',        category:'קינוחים ודסרטים', cal:220, protein:4,    carbs:26,   fat:11,   unit:'100 גרם', grams:100 },
  { id:'ds14', name:'גלידת תות',           category:'קינוחים ודסרטים', cal:190, protein:3,    carbs:25,   fat:9,    unit:'100 גרם', grams:100 },
  { id:'ds15', name:'גלידת פיסטוק',        category:'קינוחים ודסרטים', cal:230, protein:4.5,  carbs:24,   fat:13,   unit:'100 גרם', grams:100 },
  { id:'ds16', name:'שרבט לימון',          category:'קינוחים ודסרטים', cal:95,  protein:0.5,  carbs:24,   fat:0.1,  unit:'100 גרם', grams:100 },
  { id:'ds17', name:'ג׳לי',                category:'קינוחים ודסרטים', cal:62,  protein:1.6,  carbs:14,   fat:0,    unit:'100 גרם', grams:100 },
  { id:'ds18', name:'קרפ עם שוקולד',       category:'קינוחים ודסרטים', cal:280, protein:7,    carbs:38,   fat:12,   unit:'יחידה',   grams:100 },
  { id:'ds19', name:'עוגת גזר',            category:'קינוחים ודסרטים', cal:350, protein:4,    carbs:45,   fat:18,   unit:'פרוסה',   grams:80  },
  { id:'ds20', name:'עוגת תפוחים',         category:'קינוחים ודסרטים', cal:295, protein:4,    carbs:46,   fat:11,   unit:'פרוסה',   grams:80  },
  { id:'ds21', name:'פרופיטרול',           category:'קינוחים ודסרטים', cal:360, protein:6,    carbs:35,   fat:22,   unit:'מנה (3)', grams:90  },
  { id:'ds22', name:'מוס קפה',             category:'קינוחים ודסרטים', cal:250, protein:4,    carbs:25,   fat:15,   unit:'מנה',     grams:100 },
  { id:'ds23', name:'ספקולוס',             category:'קינוחים ודסרטים', cal:480, protein:6,    carbs:72,   fat:19,   unit:'יחידה',   grams:15  },
  { id:'ds24', name:'חלווה בשוקולד',       category:'קינוחים ודסרטים', cal:560, protein:12,   carbs:55,   fat:33,   unit:'100 גרם', grams:100 },
  { id:'ds25', name:'בסבוסה',              category:'קינוחים ודסרטים', cal:355, protein:5,    carbs:58,   fat:12,   unit:'יחידה',   grams:80  },
  { id:'ds26', name:'עוגת גבינה אפויה',    category:'קינוחים ודסרטים', cal:370, protein:7,    carbs:30,   fat:25,   unit:'פרוסה',   grams:90  },
  { id:'ds27', name:'פי לימון',            category:'קינוחים ודסרטים', cal:300, protein:4,    carbs:42,   fat:14,   unit:'פרוסה',   grams:90  },
  { id:'ds28', name:'טארט פירות',          category:'קינוחים ודסרטים', cal:290, protein:5,    carbs:38,   fat:14,   unit:'יחידה',   grams:90  },
  { id:'ds29', name:'ברולה קפה',           category:'קינוחים ודסרטים', cal:310, protein:5,    carbs:28,   fat:20,   unit:'מנה',     grams:120 },
  { id:'ds30', name:'גלידת גביע',          category:'קינוחים ודסרטים', cal:230, protein:3.5,  carbs:31,   fat:10,   unit:'יחידה',   grams:100 },

  // ─── מאכלים ישראליים נוספים ───
  { id:'ix01', name:'ג׳חנון',              category:'מאכלים ישראליים', cal:340, protein:8,    carbs:42,   fat:16,   unit:'יחידה',   grams:120 },
  { id:'ix02', name:'מלאווח',              category:'מאכלים ישראליים', cal:420, protein:9,    carbs:50,   fat:21,   unit:'יחידה',   grams:150 },
  { id:'ix03', name:'לחוח',                category:'מאכלים ישראליים', cal:180, protein:5,    carbs:34,   fat:2.5,  unit:'יחידה',   grams:80  },
  { id:'ix04', name:'ממולאים עלי גפן',    category:'מאכלים ישראליים', cal:90,  protein:3,    carbs:12,   fat:3.5,  unit:'יחידה',   grams:35  },
  { id:'ix05', name:'פול מדמס',            category:'מאכלים ישראליים', cal:150, protein:8,    carbs:24,   fat:3,    unit:'מנה',     grams:200 },
  { id:'ix06', name:'מסאחן',               category:'מאכלים ישראליים', cal:420, protein:28,   carbs:35,   fat:18,   unit:'מנה',     grams:300 },
  { id:'ix07', name:'קובה',               category:'מאכלים ישראליים', cal:290, protein:12,   carbs:28,   fat:15,   unit:'יחידה',   grams:100 },
  { id:'ix08', name:'מוחמרה',              category:'מאכלים ישראליים', cal:310, protein:5,    carbs:22,   fat:23,   unit:'100 גרם', grams:100 },
  { id:'ix09', name:'לוביה בעגבנייה',      category:'מאכלים ישראליים', cal:130, protein:7,    carbs:22,   fat:2.5,  unit:'100 גרם', grams:100 },
  { id:'ix10', name:'עוף מרוקאי עם זיתים',category:'מאכלים ישראליים', cal:240, protein:26,   carbs:6,    fat:13,   unit:'100 גרם', grams:100 },
  { id:'ix11', name:'דג מרוקאי חריף',     category:'מאכלים ישראליים', cal:180, protein:22,   carbs:8,    fat:7,    unit:'100 גרם', grams:100 },
  { id:'ix12', name:'מרק שגרבי',           category:'מאכלים ישראליים', cal:180, protein:8,    carbs:20,   fat:7,    unit:'צלחת',    grams:350 },
  { id:'ix13', name:'קבב עם אורז',         category:'מאכלים ישראליים', cal:430, protein:25,   carbs:40,   fat:18,   unit:'מנה',     grams:350 },
  { id:'ix14', name:'חומוס עם בשר',        category:'מאכלים ישראליים', cal:450, protein:22,   carbs:38,   fat:22,   unit:'מנה',     grams:300 },
  { id:'ix15', name:'פלאפל בלאפה',         category:'מאכלים ישראליים', cal:520, protein:16,   carbs:64,   fat:24,   unit:'מנה',     grams:320 },

  // ─── חטיפים בריאים ───
  { id:'sn01', name:'אדממה מלוחה',         category:'חטיפים בריאים',   cal:122, protein:11,   carbs:9,    fat:5,    unit:'100 גרם', grams:100 },
  { id:'sn02', name:'חומוס עם גזרים',      category:'חטיפים בריאים',   cal:180, protein:6,    carbs:20,   fat:9,    unit:'מנה',     grams:130 },
  { id:'sn03', name:'גבינה לבנה עם עגבניה',category:'חטיפים בריאים',   cal:110, protein:8,    carbs:4,    fat:6,    unit:'מנה',     grams:120 },
  { id:'sn04', name:'תפוח עם חמאת בוטנים', category:'חטיפים בריאים',   cal:250, protein:6,    carbs:32,   fat:12,   unit:'מנה',     grams:200 },
  { id:'sn05', name:'יוגורט עם דבש',       category:'חטיפים בריאים',   cal:130, protein:7,    carbs:18,   fat:3,    unit:'מנה',     grams:150 },
  { id:'sn06', name:'אגוזים מעורבים',      category:'חטיפים בריאים',   cal:607, protein:16,   carbs:21,   fat:54,   unit:'30 גרם',  grams:30  },
  { id:'sn07', name:'פרי יבש מעורב',       category:'חטיפים בריאים',   cal:290, protein:2.5,  carbs:74,   fat:0.5,  unit:'30 גרם',  grams:30  },
  { id:'sn08', name:'ביסקוויט ללא סוכר',   category:'חטיפים בריאים',   cal:320, protein:7,    carbs:55,   fat:9,    unit:'יחידה',   grams:15  },
  { id:'sn09', name:'קרקרים מלאים',        category:'חטיפים בריאים',   cal:370, protein:10,   carbs:65,   fat:8,    unit:'יחידה',   grams:10  },
  { id:'sn10', name:'זיתים',               category:'חטיפים בריאים',   cal:145, protein:1,    carbs:3.8,  fat:15,   unit:'10 יחידות',grams:40 },

  // ─── ארוחות בית נוספות ───
  { id:'hx01', name:'טוסט אבוקדו',         category:'ארוחות בית',      cal:290, protein:7,    carbs:28,   fat:17,   unit:'מנה',     grams:180 },
  { id:'hx02', name:'חביתה עם גבינה',      category:'ארוחות בית',      cal:280, protein:16,   carbs:2,    fat:22,   unit:'מנה',     grams:150 },
  { id:'hx03', name:'יוגורט עם גרנולה ופירות',category:'ארוחות בית',   cal:340, protein:12,   carbs:48,   fat:11,   unit:'מנה',     grams:250 },
  { id:'hx04', name:'סמוזי ירוק',          category:'ארוחות בית',      cal:180, protein:4,    carbs:32,   fat:3,    unit:'כוס',     grams:350 },
  { id:'hx05', name:'אורז עם ירקות מוקפצים',category:'ארוחות בית',    cal:175, protein:5,    carbs:30,   fat:4,    unit:'100 גרם', grams:100 },
  { id:'hx06', name:'שניצל עוף בתנור',     category:'ארוחות בית',      cal:220, protein:28,   carbs:12,   fat:6,    unit:'100 גרם', grams:100 },
  { id:'hx07', name:'מרק ירקות',           category:'ארוחות בית',      cal:55,  protein:2,    carbs:10,   fat:1,    unit:'צלחת',    grams:350 },
  { id:'hx08', name:'סלט יווני',           category:'ארוחות בית',      cal:160, protein:5,    carbs:7,    fat:13,   unit:'מנה',     grams:200 },
  { id:'hx09', name:'פסטה עם פסטו',        category:'ארוחות בית',      cal:280, protein:8,    carbs:38,   fat:11,   unit:'100 גרם', grams:100 },
  { id:'hx10', name:'קיש גבינה ותרד',      category:'ארוחות בית',      cal:295, protein:11,   carbs:20,   fat:19,   unit:'פרוסה',   grams:120 },
];

// ===== Foods CRUD =====

function getFoods() {
  const raw = localStorage.getItem(KEYS.foods);
  if (!raw) {
    localStorage.setItem(KEYS.foods, JSON.stringify(INITIAL_FOODS));
    return [...INITIAL_FOODS];
  }
  return JSON.parse(raw);
}

function saveFoods(foods) {
  localStorage.setItem(KEYS.foods, JSON.stringify(foods));
}

function addFood(food) {
  const foods = getFoods();
  food.id = 'f' + Date.now();
  foods.push(food);
  saveFoods(foods);
  return food;
}

function deleteFood(id) {
  const foods = getFoods().filter(f => f.id !== id);
  saveFoods(foods);
}

function searchFoods(query, category) {
  let foods = getFoods();
  if (category && category !== 'הכל') {
    foods = foods.filter(f => f.category === category);
  }
  if (!query.trim()) return foods;
  const q = query.trim().toLowerCase();
  return foods.filter(f => f.name.toLowerCase().includes(q) || (f.category || '').toLowerCase().includes(q));
}

function getCategories() {
  const foods = getFoods();
  const cats = [...new Set(foods.map(f => f.category).filter(Boolean))];
  return ['הכל', ...cats];
}

// ===== Calculations =====

function calcTotals(entries) {
  return entries.reduce((acc, e) => ({
    calories: acc.calories + (e.calories || 0),
    protein:  acc.protein  + (e.protein  || 0),
    carbs:    acc.carbs    + (e.carbs    || 0),
    fat:      acc.fat      + (e.fat      || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function calcEntryNutrition(food, quantityGrams) {
  const ratio = quantityGrams / food.grams;
  return {
    calories: Math.round(food.cal   * ratio),
    protein:  Math.round(food.protein * ratio * 10) / 10,
    carbs:    Math.round(food.carbs   * ratio * 10) / 10,
    fat:      Math.round(food.fat     * ratio * 10) / 10,
  };
}

// ===== DB Reset =====
function resetFoodsDB() {
  localStorage.setItem(KEYS.foods, JSON.stringify(INITIAL_FOODS));
  localStorage.setItem('food_db_version', '4');
}

(function checkDBVersion() {
  if (localStorage.getItem('food_db_version') !== '4') {
    localStorage.setItem(KEYS.foods, JSON.stringify(INITIAL_FOODS));
    localStorage.setItem('food_db_version', '4');
  }
})();
