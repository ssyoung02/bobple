import React, { useEffect, useRef } from 'react';
import Machine from './Machine';
import UILayer from './UILayer';
import '../../../../assets/style/GachaGame.scss';
import { gsap } from 'gsap';
import { getPrize, createBalls, showHint, hideHint, showHint2, prepare, start, stopJittering, pickup, pop, confetti, delay, addAnimClass } from '../../../../utils/GachaUtils';

export const uiLayerRef = React.createRef();

const GachaGame = () => {
    const appRef = useRef(null);

    useEffect(() => {
        const $app = appRef.current;
        if ($app) {
            console.log('App ref current:', $app);
            initializeGame($app);
        } else {
            console.error('appRef.current is null');
        }
    }, []);

    const initializeGame = async ($app) => {
        console.log('Initializing game with', $app);

        $app.classList.add('gotcha');

        const prize = await getPrize();
        const prizeImg = $app.querySelector('.prize-container .prize img');
        if (prizeImg) {
            prizeImg.src = prize.image;
        } else {
            console.error('.prize-container .prize img not found');
        }

        const TITLE = 'Random Gacha!';
        const PRICE = '100P';

        const $machine = $app.querySelector('.machine-container');
        if (!$machine) {
            console.error('.machine-container not found');
            return;
        }

        const $handle = $machine.querySelector('.handle');
        if (!$handle) {
            console.error('.machine-container .handle not found');
            return;
        }

        const $balls = $machine.querySelector('.balls');
        if (!$balls) {
            console.error('.machine-container .balls not found');
            return;
        }

        const $title = $app.querySelector('.title-container .title');
        if (!$title) {
            console.error('.title-container .title not found');
            return;
        }

        const $pointer = $machine.querySelector('.pointer');
        if (!$pointer) {
            console.error('.machine-container .pointer not found');
            return;
        }

        $machine.querySelector('.title').innerHTML = [...TITLE].map(e => `<span>${e}</span>`).join('');
        $machine.querySelector('.price').innerText = PRICE;

        createBalls($balls);

        gsap.set($machine, {
            y: '100vh'
        });

        gsap.set($title, {
            y: '120vh'
        });

        gsap.set($pointer, {
            opacity: 1
        });

        gsap.set('.prize-reward-container', {
            opacity: 0
        });

        setTimeout(() => prepare($handle, $machine, $title, $pointer), 500);

        $handle.addEventListener('click', () => start($handle, $machine, $title, $pointer, prize, uiLayerRef), { once: true });
    };


    return (
        <div id="app" ref={appRef}>
            <div className="container">
                <Machine/>
                <UILayer ref={uiLayerRef} />
            </div>
        </div>
    );
}

export default GachaGame;
