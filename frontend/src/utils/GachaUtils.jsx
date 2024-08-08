import { gsap, Power0 } from 'gsap';
import { RoughEase } from 'gsap/EasePack'; // 이 부분 추가
import { uiLayerRef } from '../pages/pointShop/pointGames/randomGacha/GachaGame';

let balls = [], started = false, prizeBall;
let $app, $machine, $handle, $balls, $title, $pointer;
let $$jitters = [];
let prize;
const SPEED = 1;

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const confetti = ($parent, {
    count = 100,
    x = 50,
    y = 50,
    randX = 10,
    randY = 10,
    speedX = 0,
    speedY = -2,
    speedRandX = 0.5,
    speedRandY = 0.5,
    gravity = 0.01,
    size = 10,
    sizeRand = 5
} = {}) => {

    if (!$parent) {
        console.error('Parent element not found for confetti');
        return;
    }

    const $container = document.createElement('div');
    $container.classList.add('confetti');

    const particles = [];

    for (let i = 0; i < count; i++) {
        const $particle = document.createElement('span');

        const settings = {
            dom: $particle,
            x: x + Math.random() * randX * 2 - randX,
            y: y + Math.random() * randY * 2 - randY,
            speedX: speedX + Math.random() * speedRandX * 2 - speedRandX,
            speedY: speedY + Math.random() * speedRandY * 2 - speedRandY,
            size: size + Math.random() * sizeRand * 2 - sizeRand
        };

        $particle.style.backgroundColor = `hsl(${Math.random() * 360}deg, 80%, 60%)`;
        $particle.style.setProperty('--rx', Math.random() * 2 - 1);
        $particle.style.setProperty('--ry', Math.random() * 2 - 1);
        $particle.style.setProperty('--rz', Math.random() * 2 - 1);
        $particle.style.setProperty('--rs', Math.random() * 2 + 0.5);
        particles.push(settings);
        $container.appendChild($particle);
    }

    const update = () => {
        particles.forEach((config, i) => {
            if (config.y > 100) {
                particles.splice(i, 1);
                config.dom.remove();
            }

            config.dom.style.setProperty('--size', config.size);
            config.dom.style.left = config.x + '%';
            config.dom.style.top = config.y + '%';
            config.x += config.speedX;
            config.y += config.speedY;
            config.speedY += gravity
        });

        if(particles.length) {
            requestAnimationFrame(update);
        } else {
            $container.remove();
        }
    }

    update();

    console.log('Inserting confetti into parent:', $parent);
    $parent.insertAdjacentElement('beforeend', $container);
}

export const addAnimClass = (selector, className) => {
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add(className);
        setTimeout(() => {
            element.classList.remove(className);
        }, 1000); // 애니메이션 지속 시간
    } else {
        console.error(`${selector} not found`);
    }
};

export const getPrize = async () => {
    const prizes = [
        {
            image: 'https://assets.codepen.io/2509128/prize1.png',
            title: 'Bunny'
        },
        {
            image: 'https://assets.codepen.io/2509128/prize2.png',
            title: 'Teddy Bear'
        },
        {
            image: 'https://assets.codepen.io/2509128/prize3.png',
            title: 'Polar Bear'
        },
        {
            image: 'https://assets.codepen.io/2509128/prize4.png',
            title: 'Polar Bear Bride'
        }
    ]

    return await prizes[~~(prizes.length * Math.random())];
}




// prepare 함수 정의
export const prepare = ($handle, $machine, $title, $pointer) => {
    if (!$handle) {
        console.error('$handle is undefined');
        return;
    }

    let tl = gsap.timeline();

    tl.to($machine, {
        y: '0vh',
        ease: 'none',
        duration: 0.6,
        onComplete() {
            $handle.style.cursor = 'pointer';
            $handle.addEventListener('click', () => start($handle, $machine, $title, $pointer), { once: true });

            balls.forEach(ball => {
                const tl = gsap.timeline();
                const duration = 0.05 + Math.random() * 0.1;

                tl.to(ball.dom, {
                    y: -(10 + Math.random() * 10),
                    ease: 'power1.out',
                    duration
                }).to(ball.dom, {
                    y: 0,
                    duration,
                    ease: 'power1.in'
                });

                setTimeout(() => {
                    if (!started) {
                        showHint();
                    }
                }, 2000 * SPEED);
            });
        }
    });
}


export const start = async ($handle, $machine, $title, $pointer, prize) => {
    $handle.style.cursor = 'default';
    started = true;
    hideHint();

    // handle spin and jitter
    await (() => new Promise(resolve => {
        const tl = gsap.timeline();
        tl.to($handle, {
            rotate: 90,
            duration: 0.3,
            ease: 'power1.in',
            async onComplete() {
                jitter();
                await delay(2000 * SPEED);
                await stopJittering();
                resolve();
            }
        }).to($handle, {
            rotate: 0,
            duration: 1,
        });
    }))();


    // ball drop
    await (() => new Promise(resolve => {
        const tl = gsap.timeline();
        gsap.to(prizeBall.dom, {
            x: '-3.5vh',
            ease: 'none',
            duration: 0.5,
            rotate: prizeBall.rotate + 10,
        });

        gsap.to(balls[3].dom, {
            x: '1vh',
            y: '1vh',
            ease: 'none',
            duration: 0.5,
            rotate: balls[3].rotate - 5
        });

        gsap.to(balls[4].dom, {
            x: '-1vh',
            y: '1vh',
            ease: 'none',
            duration: 0.5,
            rotate: balls[4].rotate - 5
        });

        gsap.to(balls[5].dom, {
            x: '1vh',
            y: '1vh',
            ease: 'none',
            duration: 0.5,
            rotate: balls[5].rotate - 5
        });

        tl.to(prizeBall.dom, {
            y: '15.5vh',
            ease: 'power1.in',
            duration: 0.5
        }).to(prizeBall.dom, {
            y: '24.5vh',
            ease: 'power1.in',
            duration: 0.5
        }).to(prizeBall.dom, {
            y: '22.5vh',
            ease: 'power1.out',
            duration: 0.2
        }).to(prizeBall.dom, {
            y: '23.5vh',
            ease: 'power1.in',
            duration: 0.2
        }).to(prizeBall.dom, {
            y: '23vh',
            ease: 'power1.out',
            duration: 0.1
        }).to(prizeBall.dom, {
            y: '23.5vh',
            ease: 'power1.in',
            duration: 0.1,
            onComplete: () => {
                prizeBall.dom.style.zIndex = '1000000';
                resolve();
            }
        });
    }))();

    prizeBall.dom.style.cursor = 'pointer';
    console.log('Prize ball element:', prizeBall.dom); // 콘솔 로그 추가

    let shouldShowHint = true;
    const onPrizeBallClick = () => {
        console.log('Prize ball clicked');
        prizeBall.dom.style.cursor = 'default';
        shouldShowHint = false;
        hideHint($title, $pointer);
        if (uiLayerRef.current) {
            uiLayerRef.current.style.zIndex = '10';
        }
        pickup(prizeBall);
        prizeBall.dom.removeEventListener('click', onPrizeBallClick);
    };
    prizeBall.dom.addEventListener('click', onPrizeBallClick, { once: true });

    await delay(2000);
    if (shouldShowHint) {
        showHint2($title, $pointer);
    }
};






const pickup = () => {
    console.log('pickup function called');
    console.log('prizeBall.dom:', prizeBall.dom);

    let { x, y } = prizeBall.dom.getBoundingClientRect();
    [x, y] = [x / window.innerHeight * 100, y / window.innerHeight * 100];

    const prizeBallContainer = document.querySelector('.prize-container .prize-ball-container');
    if (prizeBallContainer) {
        prizeBallContainer.appendChild(prizeBall.dom);
    } else {
        console.error('.prize-container .prize-ball-container not found');
        return;
    }

    const rotate = prizeBall.rotate;
    prizeBall.x = 0;
    prizeBall.y = 0;
    prizeBall.rotate = 0;

    prizeBall.dom.style.zIndex = '10'; // z-index를 설정하여 클릭된 공이 다른 요소 위에 보이도록 함

    addAnimClass('.game-layer', 'dim');

    gsap.set(prizeBall.dom, {
        x: `${x}vh`,
        y: `${y}vh`,
        rotate,
        duration: 1
    });

    gsap.to('.prize-container .prize-ball-container', {
        x: `-4vh`,
        y: `-4vh`,
        duration: 1
    });

    let tl = gsap.timeline();
    tl.to(prizeBall.dom, {
        x: '50vw',
        y: '50vh',
        scale: 2,
        rotate: -180,
        duration: 1,
    }).to(prizeBall.dom, {
        duration: 0.1,
        scaleX: 2.1,
        ease: 'power1.inOut',
        scaleY: 1.9
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.inOut',
        scaleX: 1.9,
        scaleY: 2.1
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.inOut',
        scaleX: 2.1,
        scaleY: 1.9
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.inOut',
        scaleX: 1.9,
        scaleY: 2.1
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.inOut',
        scaleX: 2.1,
        scaleY: 1.9
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.inOut',
        scaleX: 1.9,
        scaleY: 2.1
    }).to(prizeBall.dom, {
        duration: 0.5,
        ease: 'power1.out',
        scaleX: 2.6,
        scaleY: 1.6
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.out',
        scaleX: 1.6,
        scaleY: 2.4,
        onComplete: pop
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.out',
        scaleX: 2.1,
        scaleY: 1.9,
    }).to(prizeBall.dom, {
        duration: 0.1,
        ease: 'power1.out',
        scaleX: 2,
        scaleY: 2,
        onComplete: () => {
            // 애니메이션이 끝난 후에 z-index를 변경
            const prizeRewardContainer = document.querySelector('.prize-reward-container');
            if (prizeRewardContainer) {
                prizeRewardContainer.style.zIndex = '200000'; // 필요한 z-index 값으로 변경
            }
        }
    });
}


const pop = () => {
    confetti($app, {
        speedX: 0,
        speedRandY: 1,
        speedRandX: 0.75,
        speedY: -0.5,
        gravity: 0.02,
        y: 50,
        randX: 6,
        randY: 6,
        size: 8,
        sizeRand: 4,
        count: 128
    });

    gsap.set('.prize-reward-container .prize', {
        scale: 0
    });

    gsap.to('.prize-reward-container', {
        opacity: 1,
        duration: 0.3
    });

    gsap.to('.prize-reward-container .prize', {
        scale: 1,
        duration: 0.5,
        ease: 'back.out'
    });

    gsap.to(prizeBall.dom, {
        opacity: 0
    });

    if ($title) {
        gsap.set($title, {
            y: '-50vh',
        });

        if ($title.children && $title.children[0]) {
            $title.children[0].innerHTML = `You got a<br>${prize.title}`;
        } else {
            console.error('$title.children[0] is undefined or null');
        }

        gsap.to($title, {
            delay: 1,
            y: '5vh',
            duration: 0.6
        });
    } else {
        console.error('$title is undefined or null');
    }

    gsap.to($machine, {
        y: '100vh',
        duration: 1,
        delay: 1,
        onComplete() {
            if ($machine) {
                $machine.remove();
            } else {
                console.error('$machine is undefined or null');
            }
        }
    });
}


export const showHint = ($title, $pointer) => {
    gsap.set($pointer, { opacity: 0 });

    gsap.to($title, {
        y: '80vh',
        duration: 1,
        ease: 'back.out'
    });

    gsap.to($pointer, {
        opacity: 1,
        duration: 1,
        ease: 'none'
    });
};

export const hideHint = ($title, $pointer) => {
    gsap.to($title, {
        y: '120vh',
        duration: 0.6
    });

    gsap.to($pointer, {
        opacity: 0,
        duration: 1
    });
};

const showHint2 = ($title, $pointer) => {
    if ($title && $title.children && $title.children[0]) {
        $title.children[0].innerHTML = 'Tap to claim it!';
    } else {
        console.error('Title element or its children not found.');
    }

    gsap.set($pointer, {
        x: '16vh',
        y: '3vh'
    });

    gsap.to($title, {
        y: '80vh',
        duration: 1,
        ease: 'back.out'
    });

    gsap.to($pointer, {
        opacity: 1,
        duration: 1,
        ease: 'none'
    });
};

export const createBalls = ($balls) => {
    balls = [];
    let id = 0;
    const createBall = (x, y, rotate = ~~(Math.random() * 360), hue = ~~(Math.random() * 360)) => {
        const size = 8;
        const $ball = document.createElement('figure');
        $ball.classList.add('ball');
        $ball.setAttribute('data-id', ++id);
        $ball.style.setProperty('--size', `${size}vh`);
        $ball.style.setProperty('--color1', `hsl(${hue}deg, 80%, 70%)`);
        $ball.style.setProperty('--color2', `hsl(${hue + 20}deg, 50%, 90%)`);
        $ball.style.setProperty('--outline', `hsl(${hue}deg, 50%, 55%)`);

        $balls.appendChild($ball);

        if (!$balls) {
            console.error('$balls is undefined');
            return;
        }

        $balls.appendChild($ball);

        const update = () => {
            gsap.set($ball, {
                css: {
                    left: `calc(${x} * (100% - ${size}vh) / 2)`,
                    top: `calc(${y} * (100% - ${size}vh) / 2)`,
                    transform: `rotate(${rotate}deg)`,
                    pointerEvents: 'auto' // 클릭 가능하도록 설정
                },
            });
        }

        const ball = {
            dom: $ball,
            get x() {
                return x;
            },
            get y() {
                return y;
            },
            get rotate() {
                return rotate;
            },
            set x(value) {
                x = value;
                update();
            },
            set y(value) {
                y = value;
                update();
            },
            set rotate(value) {
                rotate = value;
                update();
            },
            get size() {
                return size;
            }
        };

        balls.push(ball);

        update();

        return ball;
    }
    createBall(0.5, 0.4);
    createBall(0, 0.48);
    createBall(0.22, 0.45);
    createBall(0.7, 0.43);
    createBall(0.96, 0.46);

    createBall(0.75, 0.69);
    createBall(0.5, 0.7);
    prizeBall = createBall(0.9, 0.71);
    console.log('prizeBall:', prizeBall); // 확인용 로그 추가
    createBall(0, 0.72);

    createBall(1, 0.8);
    createBall(0.25, 0.75);

    createBall(0.95, 1);
    createBall(0.4, 1);
    createBall(0.65, 1);
    createBall(0.05, 1);
}



const jitter = () => {
    balls.forEach(({ dom, rotate }, i) => {
        const tl = gsap.timeline({ repeat: -1, delay: -i * 0.0613 });

        gsap.set(dom, {
            y: 0,
            rotateZ: rotate,
        })

        const duration = Math.random() * 0.1 + 0.05;

        tl.to(dom, {
            y: -(Math.random() * 6 + 2),
            rotateZ: rotate,
            duration,
            ease: RoughEase.ease.config({
                template: Power0.easeOut,
                strength: 1,
                points: 20,
                taper: "none",
                randomize: true,
                clamp: false
            })
        }).to(dom, {
            y: 0,
            rotateZ: rotate - Math.random() * 10 - 5,
            duration,
        });

        $$jitters.push(tl);
    });

    const tl = gsap.timeline({ repeat: -1 });
    tl.to('.machine-container', {
        x: 2,
        duration: 0.1
    }).to('.machine-container', {
        x: 0,
        duration: 0.1
    });

    $$jitters.push(tl);
}

const stopJittering = async () => {
    $$jitters.forEach($$jitter => $$jitter.pause());

    balls.forEach(({ dom, rotate }, i) => {
        gsap.to(dom, {
            y: 0,
            rotate,
            duration: 0.1
        })
    });

    gsap.to('.machine-container', {
        x: 0,
        duration: 0.1
    });

    await delay(200);
}
