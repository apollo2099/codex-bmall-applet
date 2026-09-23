/**
 * 商品模拟数据
 * 说明：示例项目不引入图片资源，商品图使用「浅色底 + emoji」占位。
 * 分类与轮播使用统一的线性图标（icon 字段），接入真实图片时把 cover 换成图片地址即可。
 */

const categories = [
  { id: 'c1', name: '手机数码', emoji: '📱', icon: 'phone', tint: '#eaf6fe', accent: '#1abcfe' },
  { id: 'c2', name: '服饰鞋包', emoji: '👕', icon: 'shirt', tint: '#ffefeb', accent: '#ff7262' },
  { id: 'c3', name: '食品生鲜', emoji: '🍎', icon: 'apple', tint: '#e8f9f1', accent: '#0acf83' },
  { id: 'c4', name: '家居生活', emoji: '🛋️', icon: 'sofa', tint: '#fef1ec', accent: '#f24e1e' },
  { id: 'c5', name: '美妆护肤', emoji: '💄', icon: 'droplet', tint: '#f4edfe', accent: '#a259ff' },
  { id: 'c6', name: '运动户外', emoji: '🏀', icon: 'dumbbell', tint: '#eaf2fe', accent: '#0d99ff' }
]

const banners = [
  {
    id: 'b1',
    title: '秋季数码焕新',
    subtitle: '爆款直降 300 元',
    tint: '#1e1e1e',
    emoji: '📱',
    icon: 'phone',
    accent: '#a259ff',
    goodsId: 'g1001'
  },
  {
    id: 'b2',
    title: '生鲜每日直达',
    subtitle: '满 99 减 30',
    tint: '#1e1e1e',
    emoji: '🥬',
    icon: 'apple',
    accent: '#0acf83',
    goodsId: 'g3001'
  },
  {
    id: 'b3',
    title: '运动户外专场',
    subtitle: '第二件半价',
    tint: '#1e1e1e',
    emoji: '🏃',
    icon: 'dumbbell',
    accent: '#1abcfe',
    goodsId: 'g6001'
  }
]

const specsCommon = {
  color: (values) => ({ name: '颜色', values }),
  version: (values) => ({ name: '版本', values }),
  size: (values) => ({ name: '规格', values })
}

const goodsList = [
  {
    id: 'g1001',
    title: '极简真无线蓝牙耳机 Pro',
    subTitle: '主动降噪 · 40 小时长续航 · 双设备连接',
    categoryId: 'c1',
    price: 399,
    originPrice: 699,
    sales: 12860,
    stock: 328,
    emoji: '🎧',
    tint: '#eaf6fe',
    tags: ['顺丰包邮', '7 天无理由', '现货'],
    isHot: true,
    isNew: false,
    specs: [specsCommon.color(['星空黑', '象牙白', '雾霾蓝']), specsCommon.version(['标准版', '降噪版'])],
    detail: {
      desc:
        '采用 13mm 复合振膜单元，配合自适应主动降噪算法，通勤路上也能拥有安静的聆听空间。单次续航 10 小时，搭配充电盒可达 40 小时。',
      highlights: ['-42dB 深度降噪', '40 小时总续航', '双设备无缝切换', 'IPX5 级防水'],
      params: [
        { label: '品牌', value: '优选声学' },
        { label: '型号', value: 'Pro 2024' },
        { label: '蓝牙版本', value: 'Bluetooth 5.3' },
        { label: '充电接口', value: 'Type-C' },
        { label: '整机重量', value: '约 48g' }
      ]
    }
  },
  {
    id: 'g1002',
    title: '6.7 英寸轻薄旗舰手机',
    subTitle: '2 亿像素影像 · 120Hz 高刷屏',
    categoryId: 'c1',
    price: 3299,
    originPrice: 3699,
    sales: 3420,
    stock: 120,
    emoji: '📱',
    tint: '#e8f2ff',
    tags: ['12 期免息', '以旧换新'],
    isHot: true,
    isNew: true,
    specs: [specsCommon.color(['曜石黑', '月华银']), { name: '内存', values: ['8+256G', '12+512G'] }],
    detail: {
      desc: '旗舰级影像系统与轻薄机身的平衡之作，支持 120Hz 自适应刷新率与 66W 快充。',
      highlights: ['2 亿像素主摄', '120Hz 自适应高刷', '66W 疾速快充', '7.9mm 轻薄机身'],
      params: [
        { label: '屏幕尺寸', value: '6.7 英寸' },
        { label: '电池容量', value: '4800mAh' },
        { label: '充电功率', value: '66W' },
        { label: '重量', value: '188g' }
      ]
    }
  },
  {
    id: 'g1003',
    title: '降噪办公机械键盘 87 键',
    subTitle: '三模连接 · 热插拔轴体 · 客制化键帽',
    categoryId: 'c1',
    price: 269,
    originPrice: 359,
    sales: 5210,
    stock: 260,
    emoji: '⌨️',
    tint: '#edf3ff',
    tags: ['包邮'],
    isHot: false,
    isNew: true,
    specs: [{ name: '轴体', values: ['红轴', '茶轴', '青轴'] }, specsCommon.color(['奶白', '深灰'])],
    detail: {
      desc: '紧凑 87 键布局，支持有线 / 蓝牙 / 2.4G 三模连接，桌面更清爽。',
      highlights: ['三模连接', '全键热插拔', 'Gasket 结构', 'RGB 背光'],
      params: [
        { label: '按键数', value: '87 键' },
        { label: '连接方式', value: '有线/蓝牙/2.4G' },
        { label: '电池容量', value: '3000mAh' }
      ]
    }
  },
  {
    id: 'g2001',
    title: '重磅纯棉圆领卫衣',
    subTitle: '320g 加厚面料 · 落肩宽松版型',
    categoryId: 'c2',
    price: 159,
    originPrice: 259,
    sales: 8830,
    stock: 520,
    emoji: '👕',
    tint: '#ffefeb',
    tags: ['新品首发', '退货包运费'],
    isHot: true,
    isNew: true,
    specs: [specsCommon.color(['燕麦白', '雾霾蓝', '墨黑']), { name: '尺码', values: ['S', 'M', 'L', 'XL'] }],
    detail: {
      desc: '320g 重磅纯棉面料，落肩设计修饰身形，秋冬内搭外穿都合适。',
      highlights: ['320g 重磅面料', '不易变形', '落肩宽松版型'],
      params: [
        { label: '材质', value: '100% 棉' },
        { label: '克重', value: '320g' },
        { label: '版型', value: '宽松' }
      ]
    }
  },
  {
    id: 'g2002',
    title: '轻量防泼水通勤双肩包',
    subTitle: '可容纳 15.6 英寸笔记本 · 大容量分层',
    categoryId: 'c2',
    price: 229,
    originPrice: 329,
    sales: 4120,
    stock: 180,
    emoji: '🎒',
    tint: '#ffeaea',
    tags: ['顺丰包邮'],
    isHot: false,
    isNew: false,
    specs: [specsCommon.color(['炭黑', '浅灰', '雾蓝'])],
    detail: {
      desc: '约 720g 轻量设计，防泼水面料，多分区收纳让通勤更从容。',
      highlights: ['15.6 英寸电脑仓', '防泼水面料', '背部透气减压'],
      params: [
        { label: '容量', value: '22L' },
        { label: '面料', value: '聚酯纤维' },
        { label: '重量', value: '720g' }
      ]
    }
  },
  {
    id: 'g2003',
    title: '复古厚底休闲运动鞋',
    subTitle: '增高 4cm · 缓震回弹大底',
    categoryId: 'c2',
    price: 299,
    originPrice: 459,
    sales: 6740,
    stock: 300,
    emoji: '👟',
    tint: '#ffefee',
    tags: ['7 天无理由'],
    isHot: true,
    isNew: false,
    specs: [specsCommon.color(['米白', '黑白']), { name: '尺码', values: ['36', '37', '38', '39', '40', '41', '42'] }],
    detail: {
      desc: '复古线条搭配厚底设计，缓震中底久站久走也不累脚。',
      highlights: ['增高 4cm', '缓震中底', '透气鞋面'],
      params: [
        { label: '鞋面', value: '头层牛皮 + 织物' },
        { label: '鞋底', value: 'EVA 缓震大底' },
        { label: '跟高', value: '4cm' }
      ]
    }
  },
  {
    id: 'g3001',
    title: '云南高山蓝莓 4 盒装',
    subTitle: '当天采摘 · 冷链直发 · 果径 18mm+',
    categoryId: 'c3',
    price: 89,
    originPrice: 139,
    sales: 15320,
    stock: 90,
    emoji: '🫐',
    tint: '#e8f9f1',
    tags: ['冷链直发', '坏果包赔'],
    isHot: true,
    isNew: false,
    specs: [{ name: '规格', values: ['125g*4 盒', '125g*8 盒'] }],
    detail: {
      desc: '云南高原产区直采，当日采摘当日发货，全程冷链到家。',
      highlights: ['果径 18mm+', '当日采摘', '坏果包赔'],
      params: [
        { label: '产地', value: '云南曲靖' },
        { label: '保存方式', value: '0-4℃ 冷藏' },
        { label: '保质期', value: '冷藏 7 天' }
      ]
    }
  },
  {
    id: 'g3002',
    title: '每日坚果混合装 30 袋',
    subTitle: '7 种坚果果干 · 独立小包装',
    categoryId: 'c3',
    price: 79,
    originPrice: 129,
    sales: 22100,
    stock: 800,
    emoji: '🥜',
    tint: '#eaf7ee',
    tags: ['量贩装', '包邮'],
    isHot: true,
    isNew: false,
    specs: [{ name: '口味', values: ['原味', '混合装'] }, { name: '规格', values: ['30 袋', '60 袋'] }],
    detail: {
      desc: '科学配比 7 种坚果与果干，每日一袋，加班下午茶好搭档。',
      highlights: ['7 种坚果果干', '独立包装', '0 添加蔗糖'],
      params: [
        { label: '净含量', value: '25g × 30 袋' },
        { label: '保质期', value: '180 天' },
        { label: '储存条件', value: '阴凉干燥处' }
      ]
    }
  },
  {
    id: 'g3003',
    title: '冰鲜澳洲谷饲牛排家庭装',
    subTitle: '原切厚切 · 每片 200g',
    categoryId: 'c3',
    price: 199,
    originPrice: 299,
    sales: 4360,
    stock: 150,
    emoji: '🥩',
    tint: '#e9f9f0',
    tags: ['冷链直发'],
    isHot: false,
    isNew: true,
    specs: [{ name: '套装', values: ['眼肉 × 4 片', '西冷 × 4 片', '混合 × 6 片'] }],
    detail: {
      desc: '精选澳洲谷饲牛只，原切不拼接，煎烤 3 分钟即可上桌。',
      highlights: ['原切不拼接', '厚切 2cm', '冷链配送'],
      params: [
        { label: '产地', value: '澳大利亚' },
        { label: '单片重量', value: '约 200g' },
        { label: '保存方式', value: '-18℃ 冷冻' }
      ]
    }
  },
  {
    id: 'g4001',
    title: '北欧原木四层置物架',
    subTitle: '实木框架 · 承重 20kg',
    categoryId: 'c4',
    price: 269,
    originPrice: 399,
    sales: 2870,
    stock: 210,
    emoji: '🪵',
    tint: '#fef1ec',
    tags: ['免费安装', '送货入户'],
    isHot: false,
    isNew: false,
    specs: [specsCommon.color(['原木色', '胡桃色']), { name: '层数', values: ['三层', '四层'] }],
    detail: {
      desc: '北欧极简设计，实木框架配合加厚层板，收纳整洁又有质感。',
      highlights: ['实木框架', '单层承重 20kg', '环保水性漆'],
      params: [
        { label: '尺寸', value: '60 × 30 × 120cm' },
        { label: '材质', value: '橡胶木' },
        { label: '安装', value: '含安装服务' }
      ]
    }
  },
  {
    id: 'g4002',
    title: '全棉水洗四件套',
    subTitle: '60 支长绒棉 · 亲肤透气',
    categoryId: 'c4',
    price: 359,
    originPrice: 599,
    sales: 7620,
    stock: 340,
    emoji: '🛏️',
    tint: '#fdf2e9',
    tags: ['包邮', '7 天无理由'],
    isHot: true,
    isNew: false,
    specs: [specsCommon.color(['豆沙粉', '雾灰', '奶白']), { name: '尺寸', values: ['1.5m 床', '1.8m 床'] }],
    detail: {
      desc: '60 支长绒棉面料，经预缩水处理，触感柔软细腻。',
      highlights: ['60 支长绒棉', '预缩水工艺', 'A 类婴幼儿标准'],
      params: [
        { label: '面料', value: '100% 长绒棉' },
        { label: '件数', value: '4 件套' },
        { label: '工艺', value: '活性印染' }
      ]
    }
  },
  {
    id: 'g4003',
    title: '恒温速热电热水壶',
    subTitle: '1.7L 大容量 · 5 段控温',
    categoryId: 'c4',
    price: 189,
    originPrice: 269,
    sales: 9130,
    stock: 460,
    emoji: '🫖',
    tint: '#fdf0e8',
    tags: ['一年质保'],
    isHot: false,
    isNew: false,
    specs: [specsCommon.color(['象牙白', '雅黑'])],
    detail: {
      desc: '316 不锈钢内胆，5 段控温保温，冲奶泡茶都方便。',
      highlights: ['316 不锈钢内胆', '5 段控温', '双重防烫'],
      params: [
        { label: '容量', value: '1.7L' },
        { label: '功率', value: '1800W' },
        { label: '内胆', value: '316 不锈钢' }
      ]
    }
  },
  {
    id: 'g5001',
    title: '烟酰胺焕亮精华液 30ml',
    subTitle: '5% 烟酰胺 · 提亮匀肤',
    categoryId: 'c5',
    price: 168,
    originPrice: 258,
    sales: 18900,
    stock: 620,
    emoji: '💧',
    tint: '#f4edfe',
    tags: ['正品保障', '顺丰包邮'],
    isHot: true,
    isNew: false,
    specs: [{ name: '规格', values: ['30ml', '30ml × 2'] }],
    detail: {
      desc: '5% 烟酰胺搭配传明酸，温和提亮，改善暗沉与肤色不均。',
      highlights: ['5% 烟酰胺', '传明酸协同', '温和不刺激'],
      params: [
        { label: '净含量', value: '30ml' },
        { label: '适用肤质', value: '所有肤质' },
        { label: '保质期', value: '3 年' }
      ]
    }
  },
  {
    id: 'g5002',
    title: '氨基酸温和洁面乳',
    subTitle: '弱酸性配方 · 洗后不紧绷',
    categoryId: 'c5',
    price: 79,
    originPrice: 129,
    sales: 24600,
    stock: 900,
    emoji: '🧴',
    tint: '#f5eefe',
    tags: ['敏感肌可用'],
    isHot: true,
    isNew: false,
    specs: [{ name: '规格', values: ['120g', '120g × 2'] }],
    detail: {
      desc: '氨基酸表活体系，泡沫绵密细腻，温和带走多余油脂。',
      highlights: ['氨基酸表活', '弱酸性 pH 5.5', '无酒精香精'],
      params: [
        { label: '净含量', value: '120g' },
        { label: 'pH 值', value: '5.5' },
        { label: '适用肤质', value: '敏感肌 / 混合肌' }
      ]
    }
  },
  {
    id: 'g5003',
    title: '玻尿酸补水面膜 20 片',
    subTitle: '小分子玻尿酸 · 湿敷级水量',
    categoryId: 'c5',
    price: 99,
    originPrice: 169,
    sales: 13200,
    stock: 750,
    emoji: '🧖',
    tint: '#f3ecfd',
    tags: ['量贩装'],
    isHot: false,
    isNew: true,
    specs: [{ name: '规格', values: ['20 片', '40 片'] }],
    detail: {
      desc: '每片含 25ml 精华液，膜布贴合度高，妆前急救补水首选。',
      highlights: ['25ml 精华/片', '小分子玻尿酸', '膜布亲肤'],
      params: [
        { label: '片数', value: '20 片' },
        { label: '精华含量', value: '25ml/片' },
        { label: '保质期', value: '3 年' }
      ]
    }
  },
  {
    id: 'g6001',
    title: '专业减震跑步鞋',
    subTitle: '回弹中底 · 耐磨橡胶大底',
    categoryId: 'c6',
    price: 429,
    originPrice: 599,
    sales: 5640,
    stock: 280,
    emoji: '🏃',
    tint: '#eaf2fe',
    tags: ['跑步装备', '顺丰包邮'],
    isHot: true,
    isNew: false,
    specs: [specsCommon.color(['荧光蓝', '曜石黑']), { name: '尺码', values: ['39', '40', '41', '42', '43', '44'] }],
    detail: {
      desc: '超临界发泡中底，兼顾回弹与轻量，日常慢跑与长距离训练皆宜。',
      highlights: ['超临界发泡中底', '单只约 235g', '耐磨橡胶大底'],
      params: [
        { label: '适用场景', value: '公路慢跑' },
        { label: '单只重量', value: '约 235g' },
        { label: '落差', value: '8mm' }
      ]
    }
  },
  {
    id: 'g6002',
    title: '加厚防滑瑜伽垫 8mm',
    subTitle: 'TPE 环保材质 · 附收纳带',
    categoryId: 'c6',
    price: 129,
    originPrice: 199,
    sales: 10240,
    stock: 560,
    emoji: '🧘',
    tint: '#e9f0fd',
    tags: ['附赠收纳带'],
    isHot: false,
    isNew: false,
    specs: [specsCommon.color(['雾霾蓝', '豆蔻绿', '浅灰'])],
    detail: {
      desc: '8mm 加厚回弹，双面防滑纹理，居家健身与瑜伽练习都适用。',
      highlights: ['8mm 加厚', '双面防滑', '无异味 TPE'],
      params: [
        { label: '尺寸', value: '183 × 61cm' },
        { label: '厚度', value: '8mm' },
        { label: '材质', value: 'TPE' }
      ]
    }
  },
  {
    id: 'g6003',
    title: '便携折叠露营椅',
    subTitle: '铝合金支架 · 承重 120kg',
    categoryId: 'c6',
    price: 189,
    originPrice: 279,
    sales: 3180,
    stock: 190,
    emoji: '🏕️',
    tint: '#ebf4ff',
    tags: ['户外露营'],
    isHot: false,
    isNew: true,
    specs: [specsCommon.color(['军绿', '沙色'])],
    detail: {
      desc: '一秒折叠收纳，重量仅 1.2kg，露营、钓鱼、野餐都适用。',
      highlights: ['1 秒折叠', '承重 120kg', '仅 1.2kg'],
      params: [
        { label: '展开尺寸', value: '36 × 36 × 58cm' },
        { label: '承重', value: '120kg' },
        { label: '重量', value: '1.2kg' }
      ]
    }
  }
]

module.exports = { categories, banners, goodsList }
