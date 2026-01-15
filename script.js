const { createApp, ref, reactive, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- 核心状态 Management ---
        const loading = ref(true);
        const loadProgress = ref(0);
        const currentScene = ref('home');
        const bgmPlaying = ref(false);
        const bgmVolume = ref(0.1); // 默认音量调小
        const showBackpack = ref(false);
        
        // 模态框系统
        const modal = reactive({
            show: false,
            text: '',
            type: 'info', // info, success, error
            showBtn: true,
            callback: null
        });

        // 关卡配置
        const stages = reactive([
            { id: 1, name: '购票反诈', icon: '🎫', unlocked: true, completed: false, rhyme: '购票只认官方渠，陌生链接别点击，个人信息不泄露，候补购票最靠谱' },
            { id: 2, name: '接驳防黑', icon: '🚗', unlocked: false, completed: false, rhyme: '黑车黑车别乱上，资质发票要看清，实时定位给家人，平安接驳最放心' },
            { id: 3, name: '候车防盗', icon: '🎒', unlocked: false, completed: false, rhyme: '候车厅里人从众，贵重物品随身带，检票有序不拥挤，平安进站乐呵呵' },
            { id: 4, name: '乘车安全', icon: '🚄', unlocked: false, completed: false, rhyme: '列车睡觉防偷手，贵重物品随身走；接水只接三分二，平安到家乐悠悠' }
        ]);

        const allCompleted = computed(() => stages.every(s => s.completed));

        // --- 场景数据 Data ---
        
        // 场景1：购票
        const quiz1 = reactive([
            {
                question: '1. 以下哪种购票方式最安全？',
                bg: 'img/场景1_background1.png',
                selected: null,
                options: [
                    { text: 'A. 第三方APP弹出“加价50元优先出票”链接', correct: false, feedback: '警惕！该链接为仿冒页面，曾有用户填写信息后银行卡被盗刷！' },
                    { text: 'B. 12306官网/APP的候补购票功能', correct: true, feedback: '恭喜选对！候补购票是官方免费抢票渠道，无需额外付费' },
                    { text: 'C. 陌生短信里的“火车票改签专属通道”', correct: false, feedback: '警惕！该链接为仿冒页面，曾有用户填写信息后银行卡被盗刷！' }
                ]
            },
            {
                question: '2. 如何辨别12306官方页面？(多选)',
                bg: 'img/场景1_background2.png',
                isMulti: true,
                selected: [],
                options: [
                    { id: 'A', text: 'A. 认准唯一官网域名：只有https://www.12306.cn 是官方网站', correct: true },
                    { id: 'B', text: 'B. 确认官方标识与收款方：页面有“中国铁路12306”官方标识，支付时收款方为中国铁路网络有限公司', correct: true },
                    { id: 'C', text: 'C. 通过官方渠道进入：可通过铁路12306官方APP内的链接、12306客服电（12306）指引进入官网', correct: true }
                ]
            },
            {
                question: '3. 以下哪个是国家反诈中心来电电话？',
                bg: 'img/场景1_background3.jpg',
                selected: null,
                options: [
                    { text: 'A. 96110', correct: true, feedback: '正确！96110是全国统一反诈劝阻电话' },
                    { text: 'B. 12315', correct: false, feedback: '错误，12315是消费者投诉举报专线' },
                    { text: 'C. 12369', correct: false, feedback: '错误，12369是环保举报热线' }
                ]
            }
        ]);

        // 场景2：接驳
        const stage2Data = reactive({
            selectedCars: [], // 多选存储
            step: 1, // 1: 选车, 2: 乘车互动
            sharing: false,
            timer: null // 用于存储延时器的ID
        });

        // 场景3：找茬
        const spots3 = reactive([
            { id: 1, x: '10%', y: '50%', w: '25%', h: '35%', found: false, desc: '女生背包拉链敞开，财物外露' },
            { id: 2, x: '55%', y: '80%', w: '15%', h: '15%', found: false, desc: '候车时将手机随意放置，离开视野' },
            { id: 3, x: '53%', y: '18%', w: '16%', h: '22%', found: false, desc: '检票口有人插队，引发人群推搡' }
        ]);

        // 场景4：接水
        const waterData = reactive({
            step: 1, // 1: 存手机, 2: 接水
            height: 0,
            interval: null,
            isPouring: false
        });

        // --- 音频 Refs ---
        const audioRefs = {
            bgm: ref(null),
            soundCorrect: ref(null),
            soundError: ref(null),
            soundWater: ref(null),
            rhyme1: ref(null),
            rhyme2: ref(null),
            rhyme3: ref(null),
            rhyme4: ref(null)
        };

        // --- 辅助方法 Helpers ---
        const playSound = (key) => {
            const audio = audioRefs[key].value;
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log('Audio play failed:', e));
            }
        };

        const toggleBGM = () => {
            const bgm = audioRefs.bgm.value;
            if (!bgm) return;
            
            if (bgmPlaying.value) {
                bgm.pause();
                bgmPlaying.value = false;
            } else {
                bgm.volume = bgmVolume.value; // 确保播放时应用当前音量
                bgm.play().catch(() => {});
                bgmPlaying.value = true;
            }
        };

        const updateVolume = () => {
            const bgm = audioRefs.bgm.value;
            if (bgm) {
                bgm.volume = bgmVolume.value;
            }
        };

        // --- 核心逻辑 Logic ---

        // 1. 场景切换
        const enterStage = (index) => {
            if (!stages[index].unlocked) return;
            currentScene.value = `stage${index + 1}`;
            
            // 场景初始化
            if (index === 0) initSwiper('.stage1-swiper');
            if (index === 1) initSwiper('.stage2-swiper');
        };

        const goHome = () => {
            // 停止可能正在进行的接水逻辑
            if (waterData.isPouring) {
                stopWater();
            }
            // 停止场景2可能存在的延时器
            if (stage2Data.timer) {
                clearTimeout(stage2Data.timer);
                stage2Data.timer = null;
                stage2Data.sharing = false;
            }
            
            // 停止场景特定的音效（除了BGM）
            ['soundWater', 'soundCorrect', 'soundError', 'rhyme1', 'rhyme2', 'rhyme3', 'rhyme4'].forEach(key => {
                const audio = audioRefs[key].value;
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
            currentScene.value = 'home';
        };

        // Swiper 初始化封装
        let swiperInstances = {};
        const initSwiper = (selector) => {
            nextTick(() => {
                if (swiperInstances[selector]) {
                    swiperInstances[selector].destroy();
                }
                swiperInstances[selector] = new Swiper(selector, {
                    allowTouchMove: false, // 禁止手动滑动，必须答题
                    effect: 'fade',
                    speed: 500
                });
            });
        };

        // 2. 弹窗与口诀
        const showRhyme = (stageIndex) => {
            const stage = stages[stageIndex];
            playSound(`rhyme${stageIndex + 1}`);
            modal.text = stage.rhyme;
            modal.type = 'info'; // 显式重置为 info 类型，防止残留之前的 error 状态
            modal.showBtn = true;
            modal.show = true;
            modal.callback = () => {
                stage.completed = true;
                // 解锁下一关
                if (stageIndex < stages.length - 1) {
                    stages[stageIndex + 1].unlocked = true;
                }
                modal.show = false;
                goHome();
            };
        };

        const closeModal = () => {
            modal.show = false;
            if (modal.callback) {
                const cb = modal.callback;
                modal.callback = null;
                cb();
            }
        };

        // 3. 场景一逻辑
        // 单选：仅选中状态
        const selectOption = (stageNum, qIdx, oIdx) => {
            if (stageNum === 1) {
                const q = quiz1[qIdx];
                if (!q.isMulti) {
                    q.selected = oIdx;
                }
            }
        };

        // 多选：切换状态
        const toggleMultiOption = (stageNum, qIdx, oIdx) => {
            if (stageNum === 1) {
                const q = quiz1[qIdx];
                if (q.isMulti) {
                    const idx = q.selected.indexOf(oIdx);
                    if (idx === -1) q.selected.push(oIdx);
                    else q.selected.splice(idx, 1);
                }
            }
        };

        // 单选确认
        const confirmSingle = (stageNum, qIdx) => {
            const q = quiz1[qIdx];
            if (q.selected === null || q.selected === undefined) {
                modal.text = '请先选择一个选项喵~';
                modal.type = 'info';
                modal.showBtn = true;
                modal.callback = null;
                modal.show = true;
                return;
            }

            const opt = q.options[q.selected];
            if (opt.correct) {
                playSound('soundCorrect');
                modal.text = opt.feedback;
                modal.type = 'success';
                modal.callback = () => {
                    if (qIdx < quiz1.length - 1) {
                        swiperInstances['.stage1-swiper'].slideNext();
                    } else {
                        showRhyme(0);
                    }
                };
                modal.show = true;
            } else {
                playSound('soundError');
                modal.text = opt.feedback;
                modal.type = 'error';
                modal.callback = null;
                modal.show = true;
            }
        };
        
        // 多选确认
        const confirmMulti = (stageNum, qIdx) => {
            const q = quiz1[qIdx];
            // 判空
            if (!q.selected || q.selected.length === 0) {
                modal.text = '请至少选择一个选项喵~';
                modal.type = 'info';
                modal.showBtn = true;
                modal.callback = null;
                modal.show = true;
                return;
            }

            // 判断是否全对 (全选)
            // 简单逻辑：这道题正确答案是 A,B,C (0,1,2)，即全选
            const isAllCorrect = [0, 1, 2].every(val => q.selected.includes(val)) && q.selected.length === 3;

            if (isAllCorrect) {
                playSound('soundCorrect');
                modal.text = '回答正确！认准官方域名、标识和渠道。';
                modal.type = 'success';
                modal.callback = () => {
                    swiperInstances['.stage1-swiper'].slideNext();
                };
                modal.show = true;
            } else {
                playSound('soundError');
                modal.text = '答案不完整或有误哦，请仔细甄别！';
                modal.type = 'error';
                modal.callback = null;
                modal.show = true;
            }
        };

        // 4. 场景二逻辑 (接驳)
        const selectOption2 = (idx) => {
            // 多选车
            const i = stage2Data.selectedCars.indexOf(idx);
            if (i === -1) stage2Data.selectedCars.push(idx);
            else stage2Data.selectedCars.splice(i, 1);
        };

        const confirmStage2 = () => {
            // 正确答案是 A(0) 和 C(2)，B(1)是黑车
            const sels = stage2Data.selectedCars;
            const hasBlackCar = sels.includes(1);
            const hasA = sels.includes(0);
            const hasC = sels.includes(2);

            if (hasBlackCar) {
                playSound('soundError');
                modal.text = '这是黑车！无运营资质，曾发生司机半路加价、甩客等事件';
                modal.type = 'error';
                modal.callback = null;
                modal.show = true;
            } else if (hasA || hasC) {
                // 只要选了正规的没选黑车就算过（或者严格全选）
                playSound('soundCorrect');
                // 这里用绿色对勾提示
                modal.text = '正确！正规网约车和公交是春运接驳首选';
                modal.type = 'success';
                modal.callback = () => {
                    // 切换到下一页 (模拟分享)
                    swiperInstances['.stage2-swiper'].slideNext();
                };
                modal.show = true;
            } else {
                modal.text = '请至少选择一种安全的交通方式';
                modal.type = 'info';
                modal.show = true;
            }
        };

        const handleShareAction = (actionType) => {
            if (actionType === 'share') {
                // 触发模拟分享动画
                stage2Data.sharing = true;
                playSound('soundCorrect'); // 此时可以播放一个发送音效，这里复用正确音效
                
                // 模拟延时
                stage2Data.timer = setTimeout(() => {
                    stage2Data.sharing = false;
                    stage2Data.timer = null;
                    modal.text = '定位已发送给亲人';
                    modal.type = 'success';
                    modal.callback = () => showRhyme(1);
                    modal.show = true;
                }, 2000);
            } else {
                playSound('soundError');
                modal.text = '危险！独自乘车要时刻关注路线，尽量坐后排';
                modal.type = 'error';
                modal.show = true;
            }
        };

        // 5. 场景三逻辑 (找茬)
        const findSpot = (spot) => {
            if (spot.found) return;
            spot.found = true;
            playSound('soundCorrect');
        };

        const checkSpotsAll = () => {
            const remaining = spots3.filter(s => !s.found).length;
            if (remaining === 0) {
                showRhyme(2);
            } else {
                modal.text = `还有 ${remaining} 处隐患没找到，加油！`;
                modal.type = 'info';
                modal.show = true;
            }
        };

        // 6. 场景四逻辑 (接水)
        // 第一页：存手机
        const handlePhoneAction = (choice) => {
            // 1: 桌板(错), 2: 贴身(对), 3: 陌生人(错)
            if (choice === 2) {
                playSound('soundCorrect');
                modal.text = '正确';
                modal.type = 'success';
                modal.show = true;
                modal.callback = () => {
                   waterData.step = 2;
                };
            } else {
                playSound('soundError');
                modal.text = '危险！桌板上的手机容易被偷，陌生人不可信';
                modal.type = 'error';
                modal.show = true;
                modal.callback = null;
            }
        };

        // 第二页：接水
        const startWater = (e) => {
            if (e) e.preventDefault(); // 防止移动端长按弹出菜单
            if (waterData.isPouring) return;
            
            waterData.isPouring = true;
            playSound('soundWater');
            
            waterData.interval = setInterval(() => {
                if (waterData.height < 100) {
                    // 降低上升速度：每50ms增加0.5% (原为2%)
                    // 这样从0到66%(安全线)大约需要 6.6秒，给用户足够反应时间
                    waterData.height += 1.0;
                }
            }, 50);
        };

        const stopWater = () => {
            if (!waterData.isPouring) return;
            
            waterData.isPouring = false;
            clearInterval(waterData.interval);
            
            // 停止水声
            const waterSound = audioRefs.soundWater.value;
            if (waterSound) {
                waterSound.pause();
                waterSound.currentTime = 0;
            }

            // 判定
            // 2/3 满大约是 66%，设定合格范围为 60% - 75%
            if (waterData.height < 60) {
                playSound('soundError');
                modal.text = '请再试一试';
                modal.type = 'error';
                modal.show = true;
                waterData.height = 0;
            } else if (waterData.height > 75) {
                playSound('soundError');
                modal.text = '请再试一试';
                modal.type = 'error';
                modal.show = true;
                waterData.height = 0;
            } else {
                playSound('soundCorrect');
                showRhyme(3);
            }
        };

        // 开始体验
        const startExperience = () => {
            loading.value = false;
            // 尝试播放背景音乐（利用用户交互）
            if (!bgmPlaying.value) {
                toggleBGM();
            }
        };

        // 全局：重置
        const resetGame = () => {
            stages.forEach((s, i) => {
                s.completed = false;
                s.unlocked = i === 0;
            });
            // 重置所有内部状态
            waterData.step = 1;
            waterData.height = 0;
            waterData.isPouring = false;
            clearInterval(waterData.interval); // 清除可能存在的定时器
            
            stage2Data.selectedCars = [];
            stage2Data.sharing = false;

            spots3.forEach(s => s.found = false);
            
            // 重置场景1的选择状态
            quiz1.forEach(q => {
                if (q.isMulti) q.selected = [];
                else q.selected = null;
            });

            currentScene.value = 'home';
            
            // 确保回到首页时BGM继续播放（如果被暂停了）
            // if (!bgmPlaying.value) toggleBGM();
        };

        onMounted(() => {
            // 模拟加载
            const timer = setInterval(() => {
                loadProgress.value += 5;
                if (loadProgress.value >= 100) {
                    clearInterval(timer);
                    // 加载完成不自动关闭，等待用户点击
                }
            }, 50);
        });

        return {
            // State
            loading, loadProgress, currentScene, bgmPlaying, bgmVolume, showBackpack, modal,
            stages, allCompleted,
            quiz1, stage2Data, spots3, waterData,
            
            // Refs
            ...audioRefs,

            // Methods
            toggleBGM, updateVolume, enterStage, goHome, startExperience,
            closeModal, showRhyme, resetGame,
            
            // Scene 1
            selectOption, toggleMultiOption, confirmSingle, confirmMulti,
            // Scene 2
            selectOption2, confirmStage2, handleShareAction,
            // Scene 3
            findSpot, checkSpotsAll,
            // Scene 4
            handlePhoneAction, startWater, stopWater
        };
    }
}).mount('#app');
