/* 1001 Classical — build data.js from the curated recordings table below.
 * Each recording is a landmark/benchmark recording of a canonical work.
 * Fields: t=work title (searchable EN), zh=中文曲名, c=composer(EN key),
 *   perf=演绎(指挥/乐团/独奏), y=录音年, label, era, g=[体裁], ins=[乐器], m=[心情], r=中文导读
 */
import { writeFileSync } from "node:fs";

const ERAS = [
  {key:"medieval",name:"Medieval / 中世纪",years:"约 1150–1400",keywords:"素歌 · 复调初生 · 修道院",desc:"西方古典音乐的源头。单声的格里高利圣咏在修道院回响，随后奥尔加农让第二条声部升起——复调由此诞生。希尔德加德的通神歌咏、佩罗坦的巴黎圣母院乐派，是这段幽深岁月里最亮的光。"},
  {key:"renaissance",name:"Renaissance / 文艺复兴",years:"约 1400–1600",keywords:"无伴奏合唱 · 对位 · 弥撒经文歌",desc:"人声复调的黄金时代。若斯坎、帕勒斯特里那、塔利斯把多条声部编织成澄澈交融的织体，宗教改革与反宗教改革在弥撒与经文歌里角力，四十声部的《Spem in Alium》是纯人声所能抵达的奇迹。"},
  {key:"baroque",name:"Baroque / 巴洛克",years:"1600–1750",keywords:"通奏低音 · 赋格 · 协奏曲 · 歌剧诞生",desc:"从蒙特威尔第的第一部歌剧到巴赫的赋格宇宙。数字低音撑起华丽的装饰旋律，维瓦尔第定型协奏曲，亨德尔征服伦敦歌剧院，而巴赫把这一切技法推向前无古人、后无来者的完满。"},
  {key:"classical",name:"Classical / 古典主义",years:"约 1730–1820",keywords:"奏鸣曲式 · 均衡 · 交响曲成型",desc:"理性、均衡与清晰的时代。海顿确立交响曲与弦乐四重奏的范式，莫扎特让旋律臻于天然的完美，贝多芬则从这里出发，用意志把古典的框架撑向浪漫的门槛。"},
  {key:"romantic",name:"Romantic / 浪漫主义",years:"约 1800–1910",keywords:"个人情感 · 标题音乐 · 歌剧巨制 · 交响诗",desc:"音乐成为自我的告白。舒伯特的艺术歌曲、肖邦的夜曲、瓦格纳的乐剧、柴科夫斯基的绝望、马勒的宇宙——形式不断膨胀，情感不断加压，直到晚期浪漫在辉煌中走向裂变。"},
  {key:"modern",name:"Modern / 现代",years:"约 1900–1975",keywords:"调性瓦解 · 节奏革命 · 新语言",desc:"二十世纪把一切推倒重来。德彪西模糊调性，斯特拉文斯基的《春之祭》引发暴动，勋伯格发明十二音，巴托克、肖斯塔科维奇、布里顿在战争与极权的阴影下，为古典音乐找到全新的骨骼与良心。"},
  {key:"contemporary",name:"Contemporary / 当代",years:"约 1975–今",keywords:"简约主义 · 神圣极简 · 跨界",desc:"在先锋的极端之后，音乐重新伸手拥抱听众。赖希与格拉斯的简约脉动、佩尔特与戈雷茨基的神圣静默、约翰·亚当斯的新浪漫,让当代古典既能进音乐厅，也能进电影院与流行榜。"}
];

const MOODS = ["夜晚","沉思","激昂","疗愈","庄严","悲伤","喜悦","专注","壮丽","亲密"];
const INSTRUMENTS = ["管弦乐团","钢琴","小提琴","大提琴","人声","合唱","管风琴","羽管键琴","弦乐四重奏","长笛","单簧管","小号","吉他","打击乐"];
const FEATURED = [
  "Johann Sebastian Bach","Wolfgang Amadeus Mozart","Ludwig van Beethoven",
  "Franz Schubert","Frédéric Chopin","Johannes Brahms","Richard Wagner",
  "Pyotr Ilyich Tchaikovsky","Gustav Mahler","Claude Debussy",
  "Igor Stravinsky","Dmitri Shostakovich","Arvo Pärt","Steve Reich"
];

// ---- 曲库（均为公认的标杆/传奇录音；导读为入门向中文解说）----
const R = [
// 中世纪
["A Feather on the Breath of God","《上帝气息中的一片羽毛》","Hildegard von Bingen","Gothic Voices · Christopher Page",1982,"Hyperion","medieval",["合唱/宗教","声乐"],["人声","合唱"],["沉思","疗愈","庄严"],"十二世纪修道院长、神秘主义者、也是最早留名的作曲家之一。她的单声圣咏音域宽广、旋律像藤蔓般攀升，这张1982年的录音让希尔德加德在千年后成为畅销榜上的名字。"],
["Pérotin","《佩罗坦》","Pérotin","The Hilliard Ensemble",1989,"ECM New Series","medieval",["合唱/宗教","声乐"],["人声","合唱"],["庄严","沉思"],"巴黎圣母院乐派的巅峰。佩罗坦把素歌拉长成两声、三声、四声的奥尔加农，人声在大教堂的空间里层层堆叠——这是西方复调最早的宏伟建筑，希利亚德合唱团的演绎澄澈通透。"],
["Messe de Nostre Dame","《圣母弥撒》","Guillaume de Machaut","Ensemble Organum · Marcel Pérès",1996,"Harmonia Mundi","medieval",["合唱/宗教","声乐"],["人声","合唱"],["庄严","沉思"],"史上第一部由单一作曲家完成的完整弥撒套曲。马肖既是诗人也是作曲家，这部十四世纪的杰作把新艺术（Ars Nova）的节奏复杂性写进了神圣仪式。"],
// 文艺复兴
["Missa Pange Lingua","《潘吉舌弥撒》","Josquin des Prez","The Tallis Scholars · Peter Phillips",1986,"Gimell","renaissance",["合唱/宗教","声乐"],["人声","合唱"],["庄严","沉思","疗愈"],"若斯坎是文艺复兴盛期最伟大的复调大师，被同代人视为‘音符的主人’。塔利斯学者合唱团的这版模仿对位清澈如水晶，是进入无伴奏合唱世界的最佳门径。"],
["Missa Papae Marcelli","《马尔切鲁斯教皇弥撒》","Giovanni Pierluigi da Palestrina","The Tallis Scholars · Peter Phillips",1980,"Gimell","renaissance",["合唱/宗教","声乐"],["人声","合唱"],["庄严","疗愈"],"传说这部弥撒‘拯救了教会音乐’——它证明复调也能让歌词清晰可辨。帕勒斯特里那的对位平滑无瑕，成为此后数百年宗教复调的标准范本。"],
["Spem in Alium","《寄望于他》","Thomas Tallis","The Tallis Scholars · Peter Phillips",1985,"Gimell","renaissance",["合唱/宗教","声乐"],["人声","合唱"],["壮丽","庄严"],"四十个独立声部同时歌唱——文艺复兴合唱的珠穆朗玛。塔利斯让人声像光穿过彩窗一样在空间中环绕流动，一次纯人声的听觉奇观。"],
["Missa Assumpta est Maria","《圣母升天弥撒》","William Byrd","The Tallis Scholars",1984,"Gimell","renaissance",["合唱/宗教","声乐"],["人声","合唱"],["庄严","沉思"],"英国最伟大的文艺复兴作曲家，在新教英格兰坚守天主教信仰，把这份隐秘的虔诚写进精雕细琢的弥撒。塔利斯学者合唱团的英伦音色端庄而深情。"],
["Vespro della Beata Vergine","《圣母晚祷》","Claudio Monteverdi","John Eliot Gardiner · English Baroque Soloists",1989,"Archiv","baroque",["合唱/宗教","声乐"],["人声","合唱","管弦乐团"],["壮丽","庄严"],"横跨文艺复兴与巴洛克的巨构。蒙特威尔第把古老的素歌与崭新的歌剧笔法熔于一炉，加德纳在圣马可教堂的这版录音气势恢宏，是1610年这部杰作的标杆诠释。"],
["L'Orfeo","《奥菲欧》","Claudio Monteverdi","Nikolaus Harnoncourt · Concentus Musicus Wien",1968,"Teldec","baroque",["歌剧","声乐"],["人声","管弦乐团"],["悲伤","庄严"],"西方第一部真正意义上的歌剧。蒙特威尔第用音乐讲述奥菲欧下冥界寻妻的故事，哈农库特的本真演奏复原了1607年的音响世界，歌剧艺术从这里启程。"],
// 巴洛克
["Goldberg Variations (1955)","《哥德堡变奏曲》（1955）","Johann Sebastian Bach","Glenn Gould",1955,"Columbia","baroque",["独奏/键盘"],["钢琴"],["专注","激昂","喜悦"],"二十二岁的古尔德横空出世，以疾风般的速度、水晶般的清晰重新定义了巴赫。这张唱片让原本冷门的《哥德堡》成为古典音乐史上最著名的录音之一。"],
["Goldberg Variations (1981)","《哥德堡变奏曲》（1981）","Johann Sebastian Bach","Glenn Gould",1981,"CBS","baroque",["独奏/键盘"],["钢琴"],["沉思","专注","亲密"],"二十六年后，古尔德在生命尽头重录《哥德堡》——速度放慢，咏叹调如临终的低语。与1955版并置聆听，是一部关于时间与人生的无言之诗。"],
["Cello Suites","《无伴奏大提琴组曲》","Johann Sebastian Bach","Pablo Casals",1939,"EMI","baroque",["独奏/键盘","室内乐"],["大提琴"],["沉思","亲密","庄严"],"卡萨尔斯十三岁在旧书店偶得乐谱，练了十二年才敢公开演奏，最终在1930年代把这套被遗忘的组曲录成传世经典。没有他，就没有今天大提琴的圣经。"],
["Sonatas and Partitas for Solo Violin","《无伴奏小提琴奏鸣曲与组曲》","Johann Sebastian Bach","Nathan Milstein",1973,"Deutsche Grammophon","baroque",["独奏/键盘","室内乐"],["小提琴"],["专注","沉思","庄严"],"一把小提琴独自撑起赋格与恰空的复调宇宙。米尔斯坦的演绎兼具智性的清晰与贵族气度，尤其《d小调恰空》被誉为‘写在一根弦上的整个世界’。"],
["Mass in B minor","《b小调弥撒》","Johann Sebastian Bach","John Eliot Gardiner · Monteverdi Choir",1985,"Archiv","baroque",["合唱/宗教","声乐"],["合唱","管弦乐团"],["壮丽","庄严","疗愈"],"巴赫毕生对位与信仰的总结，一座声音的大教堂。加德纳率蒙特威尔第合唱团以本真乐器演绎，明亮而充满动能，是这部人类杰作最受推崇的现代录音之一。"],
["St Matthew Passion","《马太受难曲》","Johann Sebastian Bach","Karl Richter · Münchener Bach-Orchester",1958,"Archiv","baroque",["合唱/宗教","声乐"],["合唱","管弦乐团","人声"],["悲伤","庄严","沉思"],"西方宗教音乐的顶峰。巴赫用近三小时讲述基督受难，双合唱、双乐团交织出无尽的悲悯。里希特1958年的这版庄严肃穆，几代人心中的权威诠释。"],
["Brandenburg Concertos","《勃兰登堡协奏曲》","Johann Sebastian Bach","Trevor Pinnock · The English Concert",1982,"Archiv","baroque",["协奏曲","管弦乐"],["管弦乐团","羽管键琴"],["喜悦","激昂","专注"],"六首献给勃兰登堡侯爵的协奏曲，是巴洛克大协奏曲的百科全书。品诺克的本真演奏轻盈灵动，第五首里羽管键琴的华彩段是键盘协奏曲的开山之作。"],
["The Well-Tempered Clavier","《平均律键盘曲集》","Johann Sebastian Bach","Sviatoslav Richter",1973,"Melodiya","baroque",["独奏/键盘"],["钢琴"],["专注","沉思"],"被誉为键盘音乐的‘旧约圣经’——遍历二十四个大小调的前奏曲与赋格。里希特的演绎沉静内敛、结构如建筑般清晰，是钢琴家一生研习的对象。"],
["Messiah","《弥赛亚》","George Frideric Handel","Christopher Hogwood · Academy of Ancient Music",1980,"L'Oiseau-Lyre","baroque",["合唱/宗教","声乐"],["合唱","管弦乐团"],["壮丽","喜悦","庄严"],"《哈利路亚》大合唱响起时全场起立——这一传统延续至今。亨德尔仅用二十四天写成这部清唱剧，霍格伍德的本真版还原了1741年首演的轻盈质感。"],
["Water Music / Music for the Royal Fireworks","《水上音乐 · 皇家焰火音乐》","George Frideric Handel","John Eliot Gardiner · English Baroque Soloists",1991,"Philips","baroque",["管弦乐"],["管弦乐团","小号"],["喜悦","壮丽","激昂"],"为泰晤士河上的皇家游船与庆典焰火而作的户外盛典音乐。铜管辉煌、舞曲明快，是巴洛克最让人心情舒畅的管弦乐，加德纳演来神采飞扬。"],
["The Four Seasons","《四季》","Antonio Vivaldi","Nigel Kennedy · English Chamber Orchestra",1989,"EMI","baroque",["协奏曲"],["小提琴","管弦乐团"],["喜悦","激昂","壮丽"],"史上最著名的古典音乐之一。维瓦尔第用四首小提琴协奏曲描绘四季风景——鸟鸣、暴风雪、猎号。肯尼迪1989年的这张唱片卖出逾两百万，让《四季》红遍全球。"],
["Dido and Aeneas","《狄多与埃涅阿斯》","Henry Purcell","William Christie · Les Arts Florissants",1994,"Erato","baroque",["歌剧","声乐"],["人声","管弦乐团"],["悲伤","亲密"],"英国巴洛克歌剧的孤峰。全剧不到一小时，却以狄多临终的咏叹调《当我长眠地下》达到心碎的顶点——一条固定低音上无尽下行的悲叹，三百年来催人泪下。"],
["Keyboard Sonatas","《键盘奏鸣曲》","Domenico Scarlatti","Vladimir Horowitz",1964,"Columbia","baroque",["独奏/键盘"],["钢琴"],["喜悦","激昂","亲密"],"斯卡拉蒂写下五百五十多首单乐章奏鸣曲，充满西班牙吉他的扫弦、响板与交叉手的炫技。霍洛维茨精选的这组以钢琴演绎，晶莹剔透，证明它们跨越乐器依然鲜活。"],
// 古典主义
["The Creation","《创世纪》","Joseph Haydn","Herbert von Karajan · Berliner Philharmoniker",1969,"Deutsche Grammophon","classical",["合唱/宗教","声乐"],["合唱","管弦乐团"],["壮丽","喜悦","庄严"],"‘要有光’——当合唱在此处爆发出C大调时，是古典音乐里最震撼的瞬间之一。年迈的海顿以这部清唱剧描绘天地初开，卡拉扬的演绎恢弘而充满敬畏。"],
["Symphonies Nos. 93–104 'London'","《伦敦交响曲》","Joseph Haydn","Colin Davis · Concertgebouw / Royal Concertgebouw",1994,"Philips","classical",["交响曲"],["管弦乐团"],["喜悦","激昂","壮丽"],"‘交响曲之父’晚年为伦敦写下的十二部杰作，机智、惊喜（第94号的‘惊愕’）与工艺的巅峰。听海顿，就是听交响曲这一形式如何被一位大师彻底定型。"],
["Le nozze di Figaro","《费加罗的婚礼》","Wolfgang Amadeus Mozart","Erich Kleiber · Wiener Philharmoniker",1955,"Decca","classical",["歌剧","声乐"],["人声","管弦乐团"],["喜悦","激昂","亲密"],"歌剧史上最完美的喜剧之一。莫扎特把一部关于阶级与爱情的闹剧写成了人性的百科全书。老克莱伯1955年的维也纳录音优雅流畅，公认的黄金标准。"],
["Don Giovanni","《唐·乔万尼》","Wolfgang Amadeus Mozart","Carlo Maria Giulini · Philharmonia Orchestra",1959,"EMI","classical",["歌剧","声乐"],["人声","管弦乐团"],["激昂","庄严","夜晚"],"喜剧与恐怖、诱惑与惩罚交织的‘戏剧诙谐’。花花公子唐·乔万尼被石像拖入地狱的终场令人战栗。朱里尼这版云集Wächter、Schwarzkopf等名角，被誉为不可超越。"],
["Die Zauberflöte","《魔笛》","Wolfgang Amadeus Mozart","Otto Klemperer · Philharmonia Orchestra",1964,"EMI","classical",["歌剧","声乐"],["人声","管弦乐团"],["喜悦","庄严","壮丽"],"莫扎特最后的歌剧，一部融合童话、共济会象征与崇高人性的德语歌唱剧。夜后的花腔高音家喻户晓，克伦佩勒的演绎庄重宏大，兼具童真与哲思。"],
["Requiem","《安魂曲》","Wolfgang Amadeus Mozart","Karl Böhm · Wiener Philharmoniker",1971,"Deutsche Grammophon","classical",["合唱/宗教","声乐"],["合唱","管弦乐团"],["悲伤","庄严","沉思"],"莫扎特未及写完便撒手人寰的绝笔，一部为自己而作的安魂弥撒。《落泪之日》的哀恸令人心碎。伯姆与维也纳爱乐的演绎沉痛而崇高，是这部传奇之作的经典诠释。"],
["Piano Concertos Nos. 20 & 21","《第20 · 21钢琴协奏曲》","Wolfgang Amadeus Mozart","Clara Haskil · Ferenc Fricsay",1954,"Deutsche Grammophon","classical",["协奏曲"],["钢琴","管弦乐团"],["亲密","沉思","喜悦"],"莫扎特二十七首钢琴协奏曲是他最私密的自画像。d小调（第20号）的戏剧性与C大调（第21号）如歌的行板家喻户晓。哈斯基尔的触键纯净通透，被奉为莫扎特的化身。"],
["Symphonies Nos. 40 & 41 'Jupiter'","《第40 · 41“朱庇特”交响曲》","Wolfgang Amadeus Mozart","Bruno Walter · Columbia Symphony",1960,"Columbia","classical",["交响曲"],["管弦乐团"],["激昂","壮丽","悲伤"],"莫扎特最后三部交响曲的两座高峰：g小调（第40号）的忧郁悸动与‘朱庇特’（第41号）终曲五重赋格的辉煌。瓦尔特的演绎温暖而有呼吸感，古典交响的典范。"],
["Clarinet Concerto","《单簧管协奏曲》","Wolfgang Amadeus Mozart","Jack Brymer · Thomas Beecham",1959,"EMI","classical",["协奏曲"],["单簧管","管弦乐团"],["亲密","沉思","疗愈"],"莫扎特生命最后一年写下的天鹅之歌，为单簧管的温润音色量身定制。第二乐章的柔板宁静得近乎透明，是抚慰人心的至美旋律。"],
["Symphony No. 9 'Choral'","《第九交响曲“合唱”》","Ludwig van Beethoven","Wilhelm Furtwängler · Bayreuth Festival",1951,"EMI","classical",["交响曲","合唱/宗教"],["管弦乐团","合唱"],["壮丽","激昂","庄严"],"人类理想的音乐宣言。全聋的贝多芬在末乐章引入人声，让席勒的《欢乐颂》响彻云霄。富特文格勒1951年拜罗伊特重开音乐节的这场现场，被公认为史上最伟大的‘贝九’。"],
["Symphonies (Complete)","《贝多芬交响曲全集》","Ludwig van Beethoven","Herbert von Karajan · Berliner Philharmoniker",1963,"Deutsche Grammophon","classical",["交响曲"],["管弦乐团"],["壮丽","激昂","专注"],"卡拉扬与柏林爱乐1963年的全集，是立体声时代最具影响力的贝多芬。铿锵有力、光泽饱满，塑造了几代人对这九部交响曲的听觉印象，至今仍是入门首选。"],
["Symphonies Nos. 5 & 7","《第五 · 第七交响曲》","Ludwig van Beethoven","Carlos Kleiber · Wiener Philharmoniker",1974,"Deutsche Grammophon","classical",["交响曲"],["管弦乐团"],["激昂","壮丽","喜悦"],"‘命运在敲门’——史上最著名的四个音符。小克莱伯这版第五、第七交响曲以雷霆万钧的能量和惊人的精确度，被众多乐评评为立体声史上最伟大的唱片，无可争议的标杆。"],
["Piano Sonatas (Complete)","《贝多芬钢琴奏鸣曲全集》","Ludwig van Beethoven","Artur Schnabel",1935,"EMI","classical",["独奏/键盘"],["钢琴"],["沉思","激昂","专注"],"三十二首钢琴奏鸣曲被称为钢琴家的‘新约圣经’。施纳贝尔在1930年代第一个录下全集，技术偶有瑕疵却充满思想的重量，至今仍是最深刻的贝多芬诠释之一。"],
["Violin Concerto","《D大调小提琴协奏曲》","Ludwig van Beethoven","Jascha Heifetz · Charles Munch",1955,"RCA","classical",["协奏曲"],["小提琴","管弦乐团"],["庄严","壮丽","亲密"],"小提琴协奏曲的王者，宽广、崇高、如歌。海菲茨以无懈可击的技术与贵族气质演绎，明希的伴奏气度恢宏，是这部‘协奏曲之王’最耀眼的版本之一。"],
["Late String Quartets","《晚期弦乐四重奏》","Ludwig van Beethoven","Busch Quartet",1936,"EMI","classical",["室内乐"],["弦乐四重奏"],["沉思","悲伤","庄严"],"贝多芬最后的音乐遗言，超越时代一个世纪的孤独沉思。布什四重奏1930年代的历史录音带着炽热的信念，把这些‘从另一个星球传来’的作品演绎得撕心裂肺。"],
// 浪漫主义
["Winterreise","《冬之旅》","Franz Schubert","Dietrich Fischer-Dieskau · Gerald Moore",1972,"Deutsche Grammophon","romantic",["声乐/艺术歌曲","室内乐"],["人声","钢琴"],["悲伤","夜晚","孤独" ,"沉思"],"艺术歌曲的珠穆朗玛。二十四首歌串成一个失恋者在寒冬中的孤独漂泊，直至遇见街头的摇琴老人。费舍尔-迪斯考的男中音与摩尔的钢琴,是这部套曲不可撼动的经典。"],
["String Quintet in C","《C大调弦乐五重奏》","Franz Schubert","Isaac Stern · Pablo Casals · Prades Festival",1952,"Columbia","romantic",["室内乐"],["弦乐四重奏","大提琴"],["沉思","悲伤","亲密","疗愈"],"舒伯特去世前两个月的绝笔，室内乐无可争议的顶峰。第二乐章的柔板是时间静止的天堂,又被中段的绝望撕裂——听过的人都难以忘怀那种美到极致的忧伤。"],
["Nocturnes","《夜曲》","Frédéric Chopin","Arthur Rubinstein",1965,"RCA","romantic",["独奏/键盘"],["钢琴"],["夜晚","亲密","沉思","疗愈"],"钢琴诗人最私密的低语。二十一首夜曲把歌剧的咏叹调移植到黑白琴键上，如夜色中的独白。鲁宾斯坦优雅高贵、不事煽情的演绎，被公认为肖邦的正统。"],
["Ballades & Scherzos","《叙事曲与谐谑曲》","Frédéric Chopin","Krystian Zimerman",1987,"Deutsche Grammophon","romantic",["独奏/键盘"],["钢琴"],["激昂","悲伤","壮丽"],"四首叙事曲是肖邦最宏大的钢琴叙事，戏剧性的起伏如无字的小说。齐默尔曼的演绎技术完美、结构宏伟又饱含诗意，是当代肖邦的标杆录音。"],
["Piano Concerto No. 1 & Kinderszenen","《钢琴协奏曲 · 童年情景》","Robert Schumann","Sviatoslav Richter · Witold Rowicki",1958,"Deutsche Grammophon","romantic",["协奏曲","独奏/键盘"],["钢琴","管弦乐团"],["亲密","激昂","沉思"],"舒曼把文学的想象注入音乐。a小调钢琴协奏曲热情奔涌,《童年情景》里的《梦幻曲》则是家喻户晓的温柔。里希特兼具火焰与诗意，是舒曼理想的代言人。"],
["Violin Concerto","《e小调小提琴协奏曲》","Felix Mendelssohn","Jascha Heifetz · Charles Munch",1959,"RCA","romantic",["协奏曲"],["小提琴","管弦乐团"],["喜悦","激昂","亲密"],"最受喜爱的小提琴协奏曲之一，开篇即由独奏直入如歌的主题，一气呵成。海菲茨的演绎飞扬璀璨、气息绵长，把门德尔松的优雅与激情展现得淋漓尽致。"],
["Symphonie fantastique","《幻想交响曲》","Hector Berlioz","Charles Munch · Boston Symphony",1962,"RCA","romantic",["交响曲","管弦乐"],["管弦乐团"],["激昂","夜晚","壮丽"],"标题音乐的开山巨作。柏辽兹用音乐讲述一个艺术家因单恋服毒、坠入断头台与女巫夜宴幻梦的故事。配器天才横溢,明希与波士顿交响的演绎火花四溅。"],
["Symphony No. 4","《第四交响曲》","Johannes Brahms","Carlos Kleiber · Wiener Philharmoniker",1980,"Deutsche Grammophon","romantic",["交响曲"],["管弦乐团"],["悲伤","激昂","庄严"],"勃拉姆斯交响曲的绝唱，末乐章以古老的帕萨卡利亚变奏形式写成三十段悲壮的变奏。小克莱伯的演绎兼具结构的严谨与燃烧般的激情,是这部作品的传奇版本。"],
["Violin Concerto","《D大调小提琴协奏曲》","Johannes Brahms","David Oistrakh · George Szell",1969,"EMI","romantic",["协奏曲"],["小提琴","管弦乐团"],["庄严","壮丽","激昂"],"与贝多芬、门德尔松并称的德奥小提琴协奏曲高峰，交响性厚重、情感深沉。奥伊斯特拉赫宽广温暖的音色与塞尔精准的伴奏，被视为最权威的诠释之一。"],
["Ein deutsches Requiem","《德意志安魂曲》","Johannes Brahms","Otto Klemperer · Philharmonia",1961,"EMI","romantic",["合唱/宗教","声乐"],["合唱","管弦乐团"],["悲伤","疗愈","庄严"],"不为死者、而为生者慰藉的安魂曲。勃拉姆斯用德语圣经文本写下‘凡有血气的，尽都如草’的沉思。克伦佩勒的演绎庄严宽厚,是抚慰哀伤最深沉的音乐。"],
["Piano Sonata in B minor","《b小调钢琴奏鸣曲》","Franz Liszt","Martha Argerich",1971,"Deutsche Grammophon","romantic",["独奏/键盘"],["钢琴"],["激昂","壮丽","夜晚"],"浪漫主义钢琴文献的巅峰,一个乐章内浓缩了整部交响曲的戏剧。李斯特把炫技升华为哲学。阿格里奇的演绎狂放而精准,一泻千里,令人屏息。"],
["La traviata","《茶花女》","Giuseppe Verdi","Carlos Kleiber · Bayerisches Staatsorchester",1977,"Deutsche Grammophon","romantic",["歌剧","声乐"],["人声","管弦乐团"],["悲伤","亲密","激昂"],"世界上上演最多的歌剧之一。威尔第把小仲马笔下交际花的爱情悲剧写成催人泪下的旋律。小克莱伯指挥、科特鲁巴斯主演的这版，激情与细腻兼备。"],
["Otello","《奥赛罗》","Giuseppe Verdi","Herbert von Karajan · Wiener Philharmoniker",1961,"Decca","romantic",["歌剧","声乐"],["人声","管弦乐团"],["激昂","悲伤","壮丽"],"威尔第晚年根据莎士比亚写就的悲剧杰作，把意大利歌剧的戏剧张力推向极致。开场暴风雨的合唱惊心动魄，德尔·摩纳哥的‘奥赛罗’气壮山河。"],
["Messa da Requiem","《安魂弥撒》","Giuseppe Verdi","Fritz Reiner · Wiener Philharmoniker",1960,"Decca","romantic",["合唱/宗教","声乐"],["合唱","管弦乐团","人声"],["壮丽","激昂","庄严"],"被戏称为‘威尔第最好的歌剧’——《末日经》的定音鼓与铜管如天崩地裂，是合唱曲目中最富戏剧性的震撼。莱纳的演绎气势磅礴,录音效果传奇。"],
["Der Ring des Nibelungen","《尼伯龙根的指环》","Richard Wagner","Georg Solti · Wiener Philharmoniker",1965,"Decca","romantic",["歌剧","声乐"],["人声","管弦乐团"],["壮丽","激昂","庄严"],"录音史上的登月工程。索尔蒂历时七年（1958–65）录下这部长达十五小时的四联剧，制作人卡尔肖开创性的立体声舞台效果空前绝后。常被评为史上最伟大的录音。"],
["Tristan und Isolde","《特里斯坦与伊索尔德》","Richard Wagner","Wilhelm Furtwängler · Philharmonia",1952,"EMI","romantic",["歌剧","声乐"],["人声","管弦乐团"],["夜晚","激昂","悲伤"],"改变了音乐史的作品——开篇的‘特里斯坦和弦’悬而不决,松动了调性的根基,预示了整个二十世纪。富特文格勒的演绎把这部爱与死的乐剧演绎得如暗夜潮汐。"],
["Symphony No. 6 'Pathétique'","《第六交响曲“悲怆”》","Pyotr Ilyich Tchaikovsky","Yevgeny Mravinsky · Leningrad Philharmonic",1960,"Deutsche Grammophon","romantic",["交响曲"],["管弦乐团"],["悲伤","激昂","夜晚"],"柴科夫斯基首演九天后猝逝的绝笔,末乐章一反常规以缓慢的哀歌沉入死寂。穆拉文斯基与列宁格勒爱乐的这版冷峻锋利、张力逼人,被公认为不可逾越的诠释。"],
["Piano Concerto No. 1","《第一钢琴协奏曲》","Pyotr Ilyich Tchaikovsky","Sviatoslav Richter · Herbert von Karajan",1962,"Deutsche Grammophon","romantic",["协奏曲"],["钢琴","管弦乐团"],["激昂","壮丽","喜悦"],"开篇气势磅礴的和弦无人不晓，是最受欢迎的钢琴协奏曲。里希特钢铁般的力量与卡拉扬的辉煌交响相撞，成就了一版充满火花与张力的经典。"],
["Violin Concerto","《D大调小提琴协奏曲》","Pyotr Ilyich Tchaikovsky","Jascha Heifetz · Fritz Reiner",1957,"RCA","romantic",["协奏曲"],["小提琴","管弦乐团"],["激昂","喜悦","壮丽"],"技巧与旋律兼美的小提琴协奏曲,曾被批评‘无法演奏’,如今是每位大师的试金石。海菲茨以令人瞠目的速度与精准演绎,凌厉璀璨,酣畅淋漓。"],
["Symphony No. 9 'From the New World'","《第九交响曲“自新大陆”》","Antonín Dvořák","Herbert von Karajan · Wiener Philharmoniker",1985,"Deutsche Grammophon","romantic",["交响曲"],["管弦乐团"],["激昂","壮丽","沉思"],"德沃夏克旅美期间写下的思乡之作,融入了黑人灵歌与印第安曲调的气息。第二乐章的英国管旋律《念故乡》家喻户晓。卡拉扬的演绎大气磅礴又饱含深情。"],
["Cello Concerto","《b小调大提琴协奏曲》","Antonín Dvořák","Mstislav Rostropovich · Herbert von Karajan",1969,"Deutsche Grammophon","romantic",["协奏曲"],["大提琴","管弦乐团"],["悲伤","壮丽","沉思"],"大提琴协奏曲的皇冠。德沃夏克把思乡、爱情与告别写进这部交响性巨作。罗斯特罗波维奇如歌的琴声与卡拉扬的乐队水乳交融，被誉为难以超越的黄金组合。"],
["Piano Concerto & Peer Gynt","《钢琴协奏曲 · 培尔·金特》","Edvard Grieg","Stephen Kovacevich · Colin Davis",1971,"Philips","romantic",["协奏曲","管弦乐"],["钢琴","管弦乐团"],["激昂","喜悦","壮丽"],"格里格a小调钢琴协奏曲开篇的定音鼓与倾泻而下的和弦是浪漫主义的名片；《培尔·金特》中的《晨景》与《山魔王的大厅》更是无人不晓的北欧音画。"],
["Pictures at an Exhibition","《图画展览会》","Modest Mussorgsky","Fritz Reiner · Chicago Symphony",1957,"RCA","romantic",["管弦乐","独奏/键盘"],["管弦乐团"],["壮丽","激昂","专注"],"穆索尔斯基为纪念亡友的画展而作的钢琴组曲,经拉威尔配器成为炫目的管弦乐。从《牛车》到《基辅大门》,是展示乐队色彩的终极名片。莱纳与芝加哥交响华丽逼人。"],
["Symphony No. 2 'Resurrection'","《第二交响曲“复活”》","Gustav Mahler","Otto Klemperer · Philharmonia",1963,"EMI","romantic",["交响曲","合唱/宗教"],["管弦乐团","合唱","人声"],["壮丽","庄严","激昂"],"从葬礼进行曲到末乐章合唱‘你将复活’的巨大升腾,马勒用九十分钟叩问生死。克伦佩勒的演绎坚如磐石、崇高恢弘,是‘复活’交响曲最具重量感的丰碑。"],
["Symphony No. 5","《第五交响曲》","Gustav Mahler","Leonard Bernstein · Wiener Philharmoniker",1987,"Deutsche Grammophon","romantic",["交响曲"],["管弦乐团"],["悲伤","激昂","亲密"],"第四乐章的‘小柔板’因电影《魂断威尼斯》而闻名于世——写给妻子阿尔玛的无言情书。伯恩斯坦是马勒最炽热的信徒,他的演绎全情投入,把生死爱欲燃烧殆尽。"],
["Das Lied von der Erde","《大地之歌》","Gustav Mahler","Bruno Walter · Kathleen Ferrier",1952,"Decca","romantic",["交响曲","声乐/艺术歌曲"],["管弦乐团","人声"],["悲伤","沉思","夜晚"],"马勒以唐诗为词写下的交响声乐套曲,在东方的诗意里凝视死亡与告别。末乐章《告别》重复的‘永远’令人肝肠寸断。费里尔与瓦尔特的这版是催人泪下的传奇。"],
["Symphony No. 9","《第九交响曲》","Gustav Mahler","Herbert von Karajan · Berliner Philharmoniker",1982,"Deutsche Grammophon","romantic",["交响曲"],["管弦乐团"],["悲伤","沉思","庄严"],"马勒对尘世最后的告别,末乐章的弦乐在极弱中缓缓消散,如生命之火熄灭。卡拉扬1982年的现场录音被誉为他毕生最伟大的成就之一,静谧得令人窒息。"],
["La bohème","《波希米亚人》","Giacomo Puccini","Herbert von Karajan · Berliner Philharmoniker",1972,"Decca","romantic",["歌剧","声乐"],["人声","管弦乐团"],["悲伤","亲密","夜晚"],"关于巴黎阁楼里贫穷艺术家与绣花女咪咪的爱情悲剧,普契尼最动人的旋律尽在其中。帕瓦罗蒂与弗蕾妮的演唱、卡拉扬的指挥,成就了公认最美的一版《波希米亚人》。"],
["Tosca","《托斯卡》","Giacomo Puccini","Victor de Sabata · Maria Callas",1953,"EMI","romantic",["歌剧","声乐"],["人声","管弦乐团"],["激昂","悲伤","夜晚"],"歌剧录音史上的圣杯。卡拉斯化身歌唱家托斯卡,把爱情、谋杀与殉情演绎得惊心动魄;《为艺术,为爱情》一曲成绝唱。德·萨巴塔的指挥与之相得益彰,被公认为史上最伟大的歌剧录音。"],
["Four Last Songs","《最后四首歌》","Richard Strauss","Elisabeth Schwarzkopf · George Szell",1965,"EMI","romantic",["声乐/艺术歌曲","管弦乐"],["人声","管弦乐团"],["疗愈","悲伤","沉思"],"理查·施特劳斯八十四岁的告别之作,在晚霞般的管弦乐上从容凝视死亡。末句‘这就是死亡吗?’化入云雀般的长笛。施瓦茨科普夫的演唱温暖圆熟,是这部天鹅之歌的绝对经典。"],
["Also sprach Zarathustra","《查拉图斯特拉如是说》","Richard Strauss","Fritz Reiner · Chicago Symphony",1954,"RCA","romantic",["管弦乐"],["管弦乐团","管风琴"],["壮丽","庄严","激昂"],"因电影《2001太空漫游》而永载流行文化的开场——管风琴、定音鼓与铜管描绘日出的‘世界之谜’动机。莱纳与芝加哥交响1954年的录音是发烧友心中的试机天碟。"],
["Cello Concerto","《e小调大提琴协奏曲》","Edward Elgar","Jacqueline du Pré · John Barbirolli",1965,"EMI","romantic",["协奏曲"],["大提琴","管弦乐团"],["悲伤","沉思","疗愈"],"一战后弥漫着挽歌气息的杰作。二十岁的杜普蕾以近乎燃烧生命的投入演绎,把埃尔加的怀旧与哀伤化为琴弓下的呐喊。这个1965年的版本已成传奇,再无人能出其右。"],
["Symphony No. 2","《第二交响曲》","Jean Sibelius","Herbert von Karajan · Berliner Philharmoniker",1980,"EMI","romantic",["交响曲"],["管弦乐团"],["壮丽","激昂","庄严"],"芬兰的民族之声,终乐章从阴郁挣扎走向D大调的辉煌胜利,常被视为民族独立的象征。西贝柳斯把北欧的冷峻与炽热熔于一炉,卡拉扬的演绎大开大合,气象恢弘。"],
["Piano Concerto No. 2","《第二钢琴协奏曲》","Sergei Rachmaninoff","Sviatoslav Richter · Stanisław Wisłocki",1959,"Deutsche Grammophon","romantic",["协奏曲"],["钢琴","管弦乐团"],["悲伤","激昂","亲密","夜晚"],"最受欢迎的钢琴协奏曲,拉赫玛尼诺夫从抑郁症中走出后写下的浓情巨作,旋律绵长如江河。里希特深沉厚重的演绎把俄罗斯式的忧郁与激情推向极致。"],
["Piano Concerto No. 3","《第三钢琴协奏曲》","Sergei Rachmaninoff","Vladimir Horowitz · Eugene Ormandy",1978,"RCA","romantic",["协奏曲"],["钢琴","管弦乐团"],["激昂","壮丽","悲伤"],"被称为‘世界上最难的钢琴协奏曲’,因电影《闪亮的风采》广为人知。霍洛维茨是这部作品的化身——拉赫玛尼诺夫本人都称赞他弹得比自己更好,这版现场惊心动魄。"],
// 现代
["La mer / Prélude à l'après-midi d'un faune","《大海 · 牧神午后》","Claude Debussy","Herbert von Karajan · Berliner Philharmoniker",1964,"Deutsche Grammophon","modern",["管弦乐"],["管弦乐团"],["沉思","夜晚","疗愈"],"印象主义的旗帜。德彪西以模糊的调性、闪烁的音色描绘光影与水波,《牧神午后》的长笛开篇被视为现代音乐的起点。卡拉扬的演绎色彩斑斓、雾气氤氲。"],
["Préludes (Books 1 & 2)","《前奏曲集》","Claude Debussy","Krystian Zimerman",1994,"Deutsche Grammophon","modern",["独奏/键盘"],["钢琴"],["沉思","夜晚","亲密"],"二十四首钢琴前奏曲,每首都是一幅微型画:沉没的教堂、雪上足迹、亚麻色头发的少女。德彪西解放了钢琴的音色,齐默尔曼的演绎精致入微、意境悠远。"],
["Boléro / Daphnis et Chloé","《波莱罗 · 达夫尼斯与克洛埃》","Maurice Ravel","Charles Munch · Boston Symphony",1955,"RCA","modern",["管弦乐","芭蕾"],["管弦乐团"],["激昂","壮丽","专注"],"《波莱罗》用一个不断重复的旋律与永恒的小鼓,在十五分钟内堆积成排山倒海的高潮——一场配器的魔术。拉威尔是‘瑞士钟表匠’般的管弦乐大师,明希演来精准而奔放。"],
["Piano Concerto in G","《G大调钢琴协奏曲》","Maurice Ravel","Arturo Benedetti Michelangeli · Ettore Gracis",1957,"EMI","modern",["协奏曲"],["钢琴","管弦乐团"],["喜悦","亲密","夜晚"],"融合了爵士的俏皮与莫扎特式的优雅,第二乐章开篇长达数分钟的钢琴独白是二十世纪最美的柔板之一。米开朗杰利的演绎晶莹剔透、无懈可击。"],
["The Rite of Spring","《春之祭》","Igor Stravinsky","Igor Stravinsky · Columbia Symphony",1960,"Columbia","modern",["管弦乐","芭蕾"],["管弦乐团","打击乐"],["激昂","壮丽","专注"],"1913年首演引发骚乱的作品,原始的节奏冲击与狂暴的和声撕裂了西方音乐的调性传统,被视为二十世纪音乐的分水岭。作曲家亲自指挥,权威性无可置疑。"],
["Petrushka / The Firebird","《彼得鲁什卡 · 火鸟》","Igor Stravinsky","Pierre Boulez · New York Philharmonic",1971,"Columbia","modern",["管弦乐","芭蕾"],["管弦乐团"],["激昂","喜悦","壮丽"],"斯特拉文斯基为佳吉列夫俄罗斯芭蕾舞团写的两部早期杰作,色彩绚烂、节奏鲜活。布列兹以分析家的冷静与精确梳理出斯特拉文斯基复杂的织体,清晰锐利。"],
["Concerto for Orchestra","《乐队协奏曲》","Béla Bartók","Fritz Reiner · Chicago Symphony",1955,"RCA","modern",["管弦乐"],["管弦乐团"],["激昂","壮丽","专注"],"巴托克流亡美国、贫病交加时写下的杰作,让整个乐队轮番担任独奏‘炫技’。既有民间舞曲的活力,也有夜之音乐的神秘。莱纳与芝加哥交响的演绎锋芒毕露,堪称范本。"],
["String Quartets (Complete)","《弦乐四重奏全集》","Béla Bartók","Emerson String Quartet",1988,"Deutsche Grammophon","modern",["室内乐"],["弦乐四重奏"],["激昂","沉思","专注"],"贝多芬之后弦乐四重奏最重要的里程碑,六部作品浓缩了巴托克的全部语言:民间音乐、夜之音乐、尖锐的不协和与严密的结构。爱默生四重奏的演绎凌厉精准。"],
["Romeo and Juliet","《罗密欧与朱丽叶》","Sergei Prokofiev","Lorin Maazel · Cleveland Orchestra",1973,"Decca","modern",["芭蕾","管弦乐"],["管弦乐团"],["悲伤","激昂","壮丽"],"二十世纪最伟大的芭蕾音乐之一。《骑士之舞》那阴森庄严的主题因广告与影视广为人知。普罗科菲耶夫把莎剧的爱与恨写成惊心动魄的管弦乐,马泽尔演绎得辉煌有力。"],
["Piano Concerto No. 3","《第三钢琴协奏曲》","Sergei Prokofiev","Martha Argerich · Claudio Abbado",1967,"Deutsche Grammophon","modern",["协奏曲"],["钢琴","管弦乐团"],["激昂","喜悦","专注"],"二十世纪最受欢迎的钢琴协奏曲,兼具钢铁般的节奏动力与抒情的俄罗斯旋律。二十六岁的阿格里奇一鸣惊人,与阿巴多合作的这版充满青春的锐气与火花。"],
["Symphony No. 5","《第五交响曲》","Dmitri Shostakovich","Leonard Bernstein · New York Philharmonic",1959,"Columbia","modern",["交响曲"],["管弦乐团"],["激昂","悲伤","壮丽"],"在斯大林的高压批判下写成的‘一个苏联艺术家对正当批评的答复’。终乐章那震耳欲聋的胜利究竟是真心还是反讽?伯恩斯坦的演绎充满张力,把这层暧昧演绎得惊心动魄。"],
["String Quartet No. 8","《第八弦乐四重奏》","Dmitri Shostakovich","Borodin Quartet",1962,"Melodiya","modern",["室内乐"],["弦乐四重奏"],["悲伤","夜晚","沉思"],"作曲家献给‘法西斯主义与战争受害者’、实为自我墓志铭的作品,通篇萦绕着他名字的音乐签名DSCH。鲍罗丁四重奏的演绎冷峻而痛彻心扉,是理解肖斯塔科维奇的钥匙。"],
["Symphony No. 10","《第十交响曲》","Dmitri Shostakovich","Herbert von Karajan · Berliner Philharmoniker",1966,"Deutsche Grammophon","modern",["交响曲"],["管弦乐团"],["激昂","悲伤","壮丽"],"斯大林死后写下的杰作,第二乐章据说是暴君的音乐肖像——狂暴而短促。卡拉扬罕见地钟爱这部当代作品并两度录音,柏林爱乐的演绎精悍强劲,张力十足。"],
["Verklärte Nacht","《升华之夜》","Arnold Schoenberg","Herbert von Karajan · Berliner Philharmoniker",1974,"Deutsche Grammophon","modern",["室内乐","管弦乐"],["弦乐四重奏","管弦乐团"],["夜晚","沉思","悲伤"],"勋伯格走向无调性之前的晚期浪漫杰作,为弦乐写就的一首炽热的夜之情诗。旋律仍缠绵可听,却已在半音的暗流中悸动。卡拉扬的弦乐如天鹅绒般浓稠动人。"],
["Violin Concerto 'To the Memory of an Angel'","《小提琴协奏曲“纪念一位天使”》","Alban Berg","Itzhak Perlman · Seiji Ozawa",1978,"Deutsche Grammophon","modern",["协奏曲"],["小提琴","管弦乐团"],["悲伤","沉思","疗愈"],"为早逝的少女而作的安魂曲,贝尔格把十二音技法与巴赫的众赞歌、维也纳圆舞曲交织,让先锋语言流淌出无尽的温柔与哀恸。帕尔曼的演绎凄美动人,催人泪下。"],
["War Requiem","《战争安魂曲》","Benjamin Britten","Benjamin Britten · London Symphony",1963,"Decca","modern",["合唱/宗教","声乐"],["合唱","管弦乐团","人声"],["悲伤","庄严","沉思"],"为重建被炸毁的考文垂大教堂而作,布里顿把拉丁安魂弥撒与一战诗人欧文的反战诗篇并置,发出震撼人心的和平呼喊。作曲家亲自指挥的首演录音,是二十世纪的良心之声。"],
["Appalachian Spring","《阿巴拉契亚之春》","Aaron Copland","Aaron Copland · London Symphony",1970,"Columbia","modern",["管弦乐","芭蕾"],["管弦乐团"],["疗愈","喜悦","沉思"],"美国声音的化身。科普兰以开阔明朗的和声描绘拓荒者的婚礼,结尾对震颤派赞美诗《简单的礼物》的变奏宁静而崇高。作曲家亲自指挥,亲切而权威。"],
["Rhapsody in Blue","《蓝色狂想曲》","George Gershwin","Leonard Bernstein · Columbia Symphony",1959,"Columbia","modern",["管弦乐","协奏曲"],["钢琴","管弦乐团","单簧管"],["喜悦","激昂","夜晚"],"爵士与古典的完美联姻。开篇单簧管那声慵懒的滑音是二十世纪美国音乐最著名的开场。伯恩斯坦身兼钢琴与指挥,把纽约的喧嚣与浪漫演绎得酣畅淋漓。"],
["Carmina Burana","《布兰诗歌》","Carl Orff","Eugen Jochum · Berlin Deutsche Oper",1968,"Deutsche Grammophon","modern",["合唱/宗教","声乐"],["合唱","管弦乐团","打击乐"],["壮丽","激昂","庄严"],"开场与结尾的《哦,命运女神》因无数电影广告而家喻户晓。奥尔夫用原始有力的节奏与中世纪诗歌唤起对命运之轮的敬畏。约胡姆的演绎经作曲家亲自认可,气势磅礴。"],
["Quatuor pour la fin du temps","《为时间终结而作的四重奏》","Olivier Messiaen","Tashi Ensemble",1976,"RCA","modern",["室内乐"],["单簧管","小提琴","大提琴","钢琴"],["沉思","悲伤","疗愈"],"梅西安在纳粹战俘营里为营中仅有的乐器写就、并在零下严寒中首演的杰作。他把对上帝、鸟鸣与永恒的信仰写进这部超越时间的室内乐,神秘而崇高。"],
["Turangalîla-Symphonie","《图伦加利拉交响曲》","Olivier Messiaen","André Previn · London Symphony",1978,"EMI","modern",["交响曲","管弦乐"],["管弦乐团","钢琴"],["壮丽","激昂","喜悦"],"一部关于爱与狂喜的巨大交响曲,用上电子乐器马特诺琴发出的销魂颤音。梅西安把印度节奏、鸟鸣与感官的极乐熔铸成十乐章的宇宙盛宴,色彩绚烂夺目。"],
// 当代
["Symphony No. 3 'Symphony of Sorrowful Songs'","《第三交响曲“悲歌交响曲”》","Henryk Górecki","Dawn Upshaw · David Zinman",1992,"Nonesuch","contemporary",["交响曲","声乐/艺术歌曲"],["管弦乐团","人声"],["悲伤","疗愈","沉思"],"神圣极简主义的奇迹。三个缓慢的乐章围绕母亲与孩子的离别之痛,其中一段歌词是奥斯维辛牢房墙上的少女祷文。这张1992年的唱片意外登上流行榜,售出百万,抚慰了无数心灵。"],
["Tabula Rasa","《白板》","Arvo Pärt","Gidon Kremer · Keith Jarrett · Dennis Russell Davies",1984,"ECM New Series","contemporary",["室内乐","协奏曲"],["小提琴","钢琴","管弦乐团"],["沉思","疗愈","悲伤","亲密"],"佩尔特‘钟鸣作曲法’的巅峰,音乐澄澈如水晶、静谧如祈祷。这张开启ECM新系列的唱片重新定义了当代古典的听感——极简、神圣、直抵人心。基顿·克莱默的小提琴纯净通透。"],
["Music for 18 Musicians","《为18位音乐家而作的音乐》","Steve Reich","Steve Reich and Musicians",1978,"ECM New Series","contemporary",["室内乐"],["打击乐","钢琴","单簧管","人声"],["专注","疗愈","喜悦"],"简约主义的里程碑。持续脉动的马林巴、钢琴与人声在近一小时里缓缓相位偏移、渐变循环,像呼吸一样起伏。赖希亲自率团的这版是简约音乐最迷人的入门。"],
["Glassworks","《玻璃作品》","Philip Glass","Philip Glass Ensemble",1982,"CBS","contemporary",["室内乐"],["钢琴","管弦乐团"],["专注","夜晚","沉思"],"格拉斯写给随身听时代的简约音乐,琶音如齿轮般不停转动、层层叠加。作为进入他浩瀚宇宙(歌剧、电影配乐)的门径,《玻璃作品》亲切、催眠而美丽。"],
["Shaker Loops / Harmonium","《颤木环 · 和声》","John Adams","Edo de Waart · San Francisco Symphony",1984,"ECM / Nonesuch","contemporary",["管弦乐","合唱/宗教"],["管弦乐团","合唱"],["激昂","壮丽","专注"],"后简约主义的代表。约翰·亚当斯在赖希、格拉斯的脉动之上,重新注入浪漫主义的情感与交响的宏大。《颤木环》的弦乐颤动如能量涌流,充满美式的乐观与光辉。"],
["Études","《钢琴练习曲》","György Ligeti","Pierre-Laurent Aimard",1996,"Sony / Warner","contemporary",["独奏/键盘"],["钢琴"],["激昂","专注","壮丽"],"二十世纪末最重要的钢琴练习曲,把非洲复节奏、分形几何与钢琴的极限技巧熔于一炉,狂放而精密。艾马尔的演绎令人瞠目结舌,是当代钢琴文献的高峰。"],
["Threnody to the Victims of Hiroshima","《广岛受难者挽歌》","Krzysztof Penderecki","Krzysztof Penderecki · Polish Radio",1961,"EMI","contemporary",["管弦乐"],["管弦乐团"],["悲伤","激昂","沉思"],"五十二件弦乐器发出刺耳的音簇、滑音与敲击,把核爆的恐怖化为纯粹的声音。潘德列茨基以先锋的‘音响主义’写下这部震撼的挽歌,是二十世纪最令人难忘的抗议之声。"]
];

// ---- 作曲家小传（键 = 上面的 c 字段）----
const BIOS = {
"Hildegard von Bingen":{zh:"希尔德加德·冯·宾根",born:1098,died:1179,country:"神圣罗马帝国",role:"作曲家 · 修道院长 · 神秘主义者",bio:"中世纪最非凡的女性之一——修道院长、神学家、医者、幻视者,也是最早留下姓名的作曲家。她的单声圣咏音域宽广、旋律奔放,充满神秘的通神体验,九百年后依然动人。"},
"Pérotin":{zh:"佩罗坦",life:"活跃约 1200",country:"法国",role:"作曲家",bio:"巴黎圣母院乐派的核心人物,把两声部的奥尔加农扩展为三声、四声的宏伟复调。他是最早探索多声部纵向和声的作曲家之一,西方复调建筑的奠基者。"},
"Guillaume de Machaut":{zh:"纪尧姆·德·马肖",born:1300,died:1377,country:"法国",role:"作曲家 · 诗人",bio:"中世纪‘新艺术’(Ars Nova)的领袖,既是伟大的诗人也是作曲家。他的《圣母弥撒》是史上第一部由单一作曲家完成的完整弥撒套曲,节奏之复杂领先时代。"},
"Josquin des Prez":{zh:"若斯坎·德普雷",born:1450,died:1521,country:"佛兰德斯",role:"作曲家",bio:"文艺复兴盛期最伟大的复调大师,被同代人尊为‘音符的主人’。他把模仿对位发展到炉火纯青,情感表达细腻,深刻影响了整个欧洲的音乐语言。"},
"Giovanni Pierluigi da Palestrina":{zh:"帕勒斯特里那",born:1525,died:1594,country:"意大利",role:"作曲家",bio:"罗马乐派的代表,以平滑无瑕的对位写作被后世奉为宗教复调的典范。传说他的《马尔切鲁斯教皇弥撒》让特伦特会议相信复调音乐可以保留在教会仪式中。"},
"Thomas Tallis":{zh:"托马斯·塔利斯",born:1505,died:1585,country:"英格兰",role:"作曲家 · 管风琴师",bio:"英国文艺复兴音乐的泰斗,历经四朝宗教剧变而屹立不倒。四十声部的经文歌《Spem in Alium》是纯人声复调的奇迹,至今无人超越。"},
"William Byrd":{zh:"威廉·伯德",born:1540,died:1623,country:"英格兰",role:"作曲家",bio:"塔利斯的学生,英国最伟大的文艺复兴作曲家。身为新教英格兰中坚守信仰的天主教徒,他把隐秘的虔诚写进精雕细琢的弥撒与经文歌,同时也是键盘音乐的先驱。"},
"Claudio Monteverdi":{zh:"克劳迪奥·蒙特威尔第",born:1567,died:1643,country:"意大利",role:"作曲家",bio:"横跨文艺复兴与巴洛克的枢纽人物。他的《奥菲欧》是西方第一部真正的歌剧,《圣母晚祷》熔古今于一炉。他把音乐的重心从复调转向以情感为核心的旋律,开启了新时代。"},
"Johann Sebastian Bach":{zh:"约翰·塞巴斯蒂安·巴赫",born:1685,died:1750,country:"德国",role:"作曲家 · 管风琴师",bio:"西方音乐史的中心。巴赫把巴洛克的对位技艺推向前无古人的完满,《平均律》《赋格的艺术》《马太受难曲》《b小调弥撒》构成一座座不可逾越的高峰。他生前以管风琴演奏闻名,身后被尊为‘音乐之父’。"},
"George Frideric Handel":{zh:"乔治·弗里德里希·亨德尔",born:1685,died:1759,country:"德国 / 英国",role:"作曲家",bio:"与巴赫同年生于德国,却在伦敦成就辉煌的国际巨星。他先征服意大利歌剧,再以英语清唱剧《弥赛亚》风靡英伦。旋律恢弘大气,是巴洛克最成功的公众音乐家。"},
"Antonio Vivaldi":{zh:"安东尼奥·维瓦尔第",born:1678,died:1741,country:"意大利",role:"作曲家 · 小提琴家 · 神父",bio:"威尼斯的‘红发神父’,在女子孤儿院任教并写下大量协奏曲。他定型了快—慢—快三乐章的独奏协奏曲,《四季》以音乐描绘自然,是史上最流行的古典作品之一。"},
"Henry Purcell":{zh:"亨利·珀塞尔",born:1659,died:1695,country:"英格兰",role:"作曲家",bio:"英国巴洛克最伟大的作曲家,三十六岁英年早逝。他的歌剧《狄多与埃涅阿斯》以‘狄多的悲叹’达到心碎的顶点,融合了英语的抑扬与意大利、法国的风格。"},
"Domenico Scarlatti":{zh:"多梅尼科·斯卡拉蒂",born:1685,died:1757,country:"意大利 / 西班牙",role:"作曲家 · 羽管键琴家",bio:"与巴赫、亨德尔同年出生,长期在西班牙宫廷任职。他写下五百五十余首单乐章键盘奏鸣曲,充满西班牙民间的色彩、交叉手与大胆的和声,是键盘音乐的宝库。"},
"Joseph Haydn":{zh:"约瑟夫·海顿",born:1732,died:1809,country:"奥地利",role:"作曲家",bio:"‘交响曲之父’与‘弦乐四重奏之父’。在埃斯特哈齐宫廷供职数十年,他几乎凭一己之力确立了古典时期的核心体裁与曲式,机智幽默、工艺精湛,是莫扎特的挚友、贝多芬的老师。"},
"Wolfgang Amadeus Mozart":{zh:"沃尔夫冈·阿玛迪乌斯·莫扎特",born:1756,died:1791,country:"奥地利",role:"作曲家",bio:"音乐史上罕见的全才天才,三十五年短暂一生几乎在每个体裁都留下不朽杰作。他的旋律臻于天然的完美,歌剧洞悉人性,协奏曲优雅深情。莫扎特让复杂显得毫不费力。"},
"Ludwig van Beethoven":{zh:"路德维希·凡·贝多芬",born:1770,died:1827,country:"德国",role:"作曲家",bio:"从古典迈向浪漫的巨人。他在逐渐失聪的绝境中,用意志把交响曲、奏鸣曲、四重奏撑向前所未有的规模与深度。《第九交响曲》的《欢乐颂》是人类团结的永恒宣言。"},
"Franz Schubert":{zh:"弗朗茨·舒伯特",born:1797,died:1828,country:"奥地利",role:"作曲家",bio:"艺术歌曲之王,三十一年短暂生命里写下逾六百首歌曲与大量器乐杰作。他把诗与旋律的结合推向极致,《冬之旅》《魔王》《鳟鱼》五重奏至今传唱,晚期作品深邃动人。"},
"Frédéric Chopin":{zh:"弗雷德里克·肖邦",born:1810,died:1849,country:"波兰 / 法国",role:"作曲家 · 钢琴家",bio:"‘钢琴诗人’,几乎只为钢琴写作却拓展了这件乐器的全部诗意。夜曲、叙事曲、玛祖卡、波洛涅兹里既有沙龙的优雅,也有波兰的乡愁与民族气节。三十九岁病逝于巴黎。"},
"Robert Schumann":{zh:"罗伯特·舒曼",born:1810,died:1856,country:"德国",role:"作曲家 · 乐评家",bio:"德国浪漫主义的核心人物,把文学的想象与私密的情感注入音乐。钢琴套曲《童年情景》《狂欢节》诗意盎然,艺术歌曲深情款款。晚年受精神疾病折磨,投河获救后病逝。"},
"Felix Mendelssohn":{zh:"费利克斯·门德尔松",born:1809,died:1847,country:"德国",role:"作曲家 · 指挥家",bio:"浪漫时代的古典主义者,旋律优雅、结构清晰。他十七岁写出《仲夏夜之梦》序曲,并亲手让巴赫的《马太受难曲》重见天日,推动了巴赫复兴。小提琴协奏曲家喻户晓。"},
"Hector Berlioz":{zh:"埃克托·柏辽兹",born:1803,died:1869,country:"法国",role:"作曲家",bio:"法国浪漫主义的狂想家,配器法的革命者。《幻想交响曲》以固定乐思讲述自传式的爱情迷梦,开创了标题音乐的新纪元。他的乐队想象力大胆瑰丽,领先时代。"},
"Johannes Brahms":{zh:"约翰内斯·勃拉姆斯",born:1833,died:1897,country:"德国",role:"作曲家",bio:"古典传统在浪漫时代的守护者,被视为‘贝多芬的继承人’。他的四部交响曲结构严谨、情感深沉,室内乐与《德意志安魂曲》尤为动人。严于律己,酝酿二十余年才敢发表第一交响曲。"},
"Franz Liszt":{zh:"弗朗茨·李斯特",born:1811,died:1886,country:"匈牙利",role:"作曲家 · 钢琴家",bio:"史上最伟大的钢琴炫技家,引发了欧洲的‘李斯特狂热’。他发明了交响诗,把钢琴的技术与表现力推向极限,晚年皈依宗教,音乐转向内省甚至预示了现代的无调性。"},
"Giuseppe Verdi":{zh:"朱塞佩·威尔第",born:1813,died:1901,country:"意大利",role:"作曲家",bio:"意大利歌剧之王,也是民族统一的精神象征。从《茶花女》《弄臣》到晚年的《奥赛罗》《法尔斯塔夫》,他把戏剧张力与人性刻画不断推向新高,旋律至今响彻世界各大歌剧院。"},
"Richard Wagner":{zh:"理查·瓦格纳",born:1813,died:1883,country:"德国",role:"作曲家",bio:"歌剧史上最具革命性也最具争议的人物。他以‘乐剧’与‘整体艺术作品’的理念、无尽的旋律与主导动机,彻底重塑了歌剧。《尼伯龙根的指环》长达十五小时,《特里斯坦》松动了调性的根基。"},
"Pyotr Ilyich Tchaikovsky":{zh:"彼得·伊里奇·柴科夫斯基",born:1840,died:1893,country:"俄国",role:"作曲家",bio:"俄罗斯最受欢迎的作曲家,以无与伦比的旋律天赋打动全世界。芭蕾《天鹅湖》《胡桃夹子》、钢琴协奏曲与《悲怆》交响曲将忧郁与华丽熔于一炉,情感直击人心。"},
"Antonín Dvořák":{zh:"安东宁·德沃夏克",born:1841,died:1904,country:"捷克",role:"作曲家",bio:"波希米亚的民族之声。他把捷克民间舞曲的活力融入交响曲与室内乐,旅美期间写下《自新大陆》交响曲与大提琴协奏曲,乡愁与新世界的气息交织,旋律亲切动人。"},
"Edvard Grieg":{zh:"爱德华·格里格",born:1843,died:1907,country:"挪威",role:"作曲家 · 钢琴家",bio:"挪威民族乐派的代表,把北欧的民间曲调与自然意象写进音乐。钢琴协奏曲、《培尔·金特》组曲与大量抒情钢琴小品清新如峡湾晨雾,是浪漫主义中最有地方色彩的声音之一。"},
"Modest Mussorgsky":{zh:"莫杰斯特·穆索尔斯基",born:1839,died:1881,country:"俄国",role:"作曲家",bio:"俄罗斯‘强力集团’中最富原创性的一员,追求粗粝真实的民族之声。歌剧《鲍里斯·戈杜诺夫》与钢琴组曲《图画展览会》充满力量与色彩,尽管一生潦倒、英年早逝。"},
"Gustav Mahler":{zh:"古斯塔夫·马勒",born:1860,died:1911,country:"奥地利",role:"作曲家 · 指挥家",bio:"晚期浪漫主义交响曲的集大成者。他说‘交响曲应该像世界一样,包罗万象’,把民歌、军号、葬礼与天堂塞进庞大的九部交响曲。生前以指挥闻名,身后其音乐才征服世界。"},
"Giacomo Puccini":{zh:"贾科莫·普契尼",born:1858,died:1924,country:"意大利",role:"作曲家",bio:"威尔第之后最伟大的意大利歌剧作曲家,旋律天赋无人能及。《波希米亚人》《托斯卡》《蝴蝶夫人》《图兰朵》以浓烈的抒情与真实主义的戏剧,牢牢占据世界歌剧院的中心。"},
"Richard Strauss":{zh:"理查·施特劳斯",born:1864,died:1949,country:"德国",role:"作曲家 · 指挥家",bio:"晚期浪漫的最后一位大师。他的交响诗《查拉图斯特拉如是说》《英雄生涯》炫目辉煌,歌剧《莎乐美》《玫瑰骑士》大胆华美,晚年的《最后四首歌》则以夕阳般的从容告别人世。"},
"Edward Elgar":{zh:"爱德华·埃尔加",born:1857,died:1934,country:"英国",role:"作曲家",bio:"英国音乐复兴的旗帜。《谜语变奏曲》《威风堂堂进行曲》让英国重回作曲版图,大提琴协奏曲则以一战后的挽歌气息成为二十世纪最动人的作品之一。"},
"Jean Sibelius":{zh:"让·西贝柳斯",born:1865,died:1957,country:"芬兰",role:"作曲家",bio:"芬兰的民族英雄。交响诗《芬兰颂》成为民族独立的象征,七部交响曲以严整的结构与北欧的冷峻自成一格。晚年封笔三十年,留下沉默的传奇。"},
"Sergei Rachmaninoff":{zh:"谢尔盖·拉赫玛尼诺夫",born:1873,died:1943,country:"俄国 / 美国",role:"作曲家 · 钢琴家",bio:"最后的浪漫主义者,也是二十世纪最伟大的钢琴家之一。他的第二、第三钢琴协奏曲与《帕格尼尼主题狂想曲》旋律浓情绵长。俄国革命后流亡美国,乡愁成为他音乐永恒的底色。"},
"Claude Debussy":{zh:"克劳德·德彪西",born:1862,died:1918,country:"法国",role:"作曲家",bio:"印象主义音乐的开创者,现代音乐的先知。他模糊调性、解放和声与音色,用《牧神午后》《大海》《前奏曲》描绘光影、水波与梦境,彻底改变了人们对声音的想象。"},
"Maurice Ravel":{zh:"莫里斯·拉威尔",born:1875,died:1937,country:"法国",role:"作曲家",bio:"‘瑞士钟表匠’般精密的配器大师。他的《波莱罗》《达夫尼斯与克洛埃》《西班牙狂想曲》色彩绚烂、结构无懈可击,兼有古典的克制与感官的华美,是管弦乐配器的典范。"},
"Igor Stravinsky":{zh:"伊戈尔·斯特拉文斯基",born:1882,died:1971,country:"俄国 / 美国",role:"作曲家",bio:"二十世纪最具影响力的作曲家。《春之祭》以原始的节奏引发骚乱、劈开了现代音乐的纪元。此后他不断变身——从原始主义到新古典,再到晚年的序列主义,始终引领潮流。"},
"Béla Bartók":{zh:"贝拉·巴托克",born:1881,died:1945,country:"匈牙利",role:"作曲家 · 民族音乐学家",bio:"现代音乐的巨匠,也是民族音乐学的先驱。他跋涉乡野采集匈牙利、罗马尼亚的民歌,并将其粗粝的活力与严密的现代结构熔铸成弦乐四重奏、《乐队协奏曲》等杰作。流亡美国、贫病中辞世。"},
"Sergei Prokofiev":{zh:"谢尔盖·普罗科菲耶夫",born:1891,died:1953,country:"俄国 / 苏联",role:"作曲家 · 钢琴家",bio:"兼具尖锐的现代锋芒与俄式抒情的天才。芭蕾《罗密欧与朱丽叶》《灰姑娘》、钢琴协奏曲与《彼得与狼》广受喜爱。他与斯大林在同一天去世,讣告被领袖的死讯淹没。"},
"Dmitri Shostakovich":{zh:"德米特里·肖斯塔科维奇",born:1906,died:1975,country:"苏联",role:"作曲家",bio:"在斯大林极权阴影下坚持创作的良心。他的十五部交响曲与十五部弦乐四重奏时而高呼、时而暗讽,在官方要求与内心真实之间走钢丝,是二十世纪最深刻的音乐见证者之一。"},
"Arnold Schoenberg":{zh:"阿诺德·勋伯格",born:1874,died:1951,country:"奥地利 / 美国",role:"作曲家",bio:"无调性与十二音技法的开创者,二十世纪音乐最具决定性的革命者。他从晚期浪漫的《升华之夜》一路走向调性的解体,与学生贝尔格、韦伯恩组成‘第二维也纳乐派’,重写了作曲的规则。"},
"Alban Berg":{zh:"阿尔班·贝尔格",born:1885,died:1935,country:"奥地利",role:"作曲家",bio:"勋伯格的学生,第二维也纳乐派中最富抒情性的一位。他把十二音技法与浪漫的情感、传统的形式调和,歌剧《沃采克》与《小提琴协奏曲》证明先锋语言也能催人泪下。"},
"Benjamin Britten":{zh:"本杰明·布里顿",born:1913,died:1976,country:"英国",role:"作曲家 · 指挥家 · 钢琴家",bio:"二十世纪英国最伟大的作曲家。歌剧《彼得·格莱姆斯》让英国歌剧重生,《战争安魂曲》是震撼人心的和平宣言,《青少年管弦乐指南》则家喻户晓。他的音乐兼具现代性与深切的人文关怀。"},
"Aaron Copland":{zh:"阿隆·科普兰",born:1900,died:1990,country:"美国",role:"作曲家",bio:"‘美国音乐的院长’。他以开阔明朗的和声塑造了美国的声音——《阿巴拉契亚之春》《牧区竞技》《平凡人的号角》描绘辽阔的西部与拓荒精神,亲切、乐观而崇高。"},
"George Gershwin":{zh:"乔治·格什温",born:1898,died:1937,country:"美国",role:"作曲家 · 钢琴家",bio:"横跨古典与流行、百老汇与音乐厅的天才。《蓝色狂想曲》把爵士带进音乐厅,歌剧《波吉与贝丝》则是美国歌剧的里程碑。三十八岁因脑瘤骤逝,留下无尽惋惜。"},
"Carl Orff":{zh:"卡尔·奥尔夫",born:1895,died:1982,country:"德国",role:"作曲家 · 音乐教育家",bio:"以清唱剧《布兰诗歌》名垂青史——那原始有力的节奏与《哦,命运女神》的合唱早已成为流行文化符号。他还创立了影响深远的奥尔夫音乐教学法。"},
"Olivier Messiaen":{zh:"奥利维埃·梅西安",born:1908,died:1992,country:"法国",role:"作曲家 · 管风琴师",bio:"二十世纪最独特的声音。虔诚的天主教徒、痴迷的鸟类学家、色彩联觉者,他把宗教的狂喜、鸟鸣的记谱与异国节奏熔铸成前所未有的音响。《为时间终结而作的四重奏》在战俘营中诞生。"},
"Henryk Górecki":{zh:"亨里克·戈雷茨基",born:1933,died:2010,country:"波兰",role:"作曲家",bio:"波兰作曲家,早年写先锋音乐,后转向深沉的调性与宗教情怀。《第三交响曲“悲歌交响曲”》以缓慢的哀歌抚慰人心,1992年的录音意外售出百万张,成为神圣极简主义的象征。"},
"Arvo Pärt":{zh:"阿沃·帕尔特",born:1935,country:"爱沙尼亚",role:"作曲家",bio:"当今最常被演奏的在世作曲家之一。他发明的‘钟鸣作曲法’(tintinnabuli)以最简的三和弦与音阶营造出祈祷般的澄澈静谧,《镜中镜》《圣母颂》抚慰了无数现代心灵。"},
"Steve Reich":{zh:"史蒂夫·赖希",born:1936,country:"美国",role:"作曲家",bio:"简约主义的奠基者之一。他以‘相位偏移’与持续脉动的循环织体重塑了节奏的听感,《为18位音乐家而作的音乐》《不同的火车》影响遍及古典、电子与流行乐界。"},
"Philip Glass":{zh:"菲利普·格拉斯",born:1937,country:"美国",role:"作曲家",bio:"当代最高产、最广为人知的作曲家之一。他标志性的琶音循环与渐变结构贯穿歌剧(《海滩上的爱因斯坦》)、交响曲与大量电影配乐(《时时刻刻》),把简约主义带给了大众。"},
"John Adams":{zh:"约翰·亚当斯",born:1947,country:"美国",role:"作曲家 · 指挥家",bio:"后简约主义的代表人物,在赖希、格拉斯的脉动之上重新注入浪漫的情感与交响的宏大。歌剧《尼克松在中国》、管弦乐《颤木环》《和声学》充满美式的活力与光辉。"},
"György Ligeti":{zh:"捷尔吉·利盖蒂",born:1923,died:2006,country:"匈牙利 / 奥地利",role:"作曲家",bio:"二十世纪下半叶最富想象力的作曲家。他的‘微复调’音簇因库布里克电影《2001太空漫游》而广为人知,晚年的《钢琴练习曲》融合非洲节奏与分形几何,狂放而精密。"},
"Krzysztof Penderecki":{zh:"克日什托夫·潘德列茨基",born:1933,died:2020,country:"波兰",role:"作曲家 · 指挥家",bio:"波兰先锋音乐的旗帜。早期以《广岛受难者挽歌》等‘音响主义’作品震撼乐坛,用音簇与非常规奏法开拓声音的疆界;后期回归更具调性的宏大风格。其音乐亦常见于恐怖电影配乐。"}
};

// ---- 组装 ----
const ALBUMS = R.map((row,i)=>{
  const [t,zh,c,perf,y,label,era,g,ins,m,r] = row;
  return {id:String(i+1).padStart(4,"0"), title:t, zh, artist:c, perf, year:y, label, era, genres:g, instruments:ins, moods:m, reason:r};
});

// 校验：era / bios 引用有效性
const eraKeys = new Set(ERAS.map(e=>e.key));
let warn=0;
ALBUMS.forEach(a=>{ if(!eraKeys.has(a.era)){console.warn("BAD era",a.id,a.era);warn++;} });
const composers = new Set(ALBUMS.map(a=>a.artist));
composers.forEach(c=>{ if(!BIOS[c]) console.warn("NO bio:",c); });
console.log("recordings:",ALBUMS.length,"| composers:",composers.size,"| bios:",Object.keys(BIOS).length,"| warnings:",warn);

const banner = "/* 1001 Classical data layer — window.ALBUMS = 策展古典录音（每条为公认标杆/传奇录音）。自动生成，勿手改。 */\n";
const out =
  banner +
  "window.ERAS = " + JSON.stringify(ERAS) + ";\n" +
  "window.MOODS = " + JSON.stringify(MOODS) + ";\n" +
  "window.INSTRUMENTS = " + JSON.stringify(INSTRUMENTS) + ";\n" +
  "window.FEATURED_ARTISTS = " + JSON.stringify(FEATURED) + ";\n" +
  "window.ALBUMS = [\n" + ALBUMS.map(a=>JSON.stringify(a)).join(",\n") + "\n];\n";
writeFileSync("data.js", out);

const biosBanner =
`/* 1001 Classical — 作曲家小传（window.ARTIST_BIOS）。键 = 录音数据里的 artist（作曲家英文名）。
 * 字段：zh 译名 · born/died 生卒（在世者省略 died；乐派/群体用 life）· country 国别 · role 身份 · bio 中文小传。
 * 缺省优雅降级：无小传的作曲家仍正常显示作品列表。自动生成，勿手改。 */\n`;
writeFileSync("composers.js", biosBanner + "window.ARTIST_BIOS = " + JSON.stringify(BIOS,null,0) + ";\n");
console.log("wrote data.js + composers.js");
