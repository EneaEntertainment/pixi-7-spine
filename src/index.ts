import 'pixi-spine';

import { Application, Assets } from 'pixi.js';

import { Spine } from '@pixi-spine/runtime-4.1';
import { TranscoderWorker } from '@pixi/basis';

let now = performance.now();
let then = now;

window.onload = main;

async function main()
{
    await TranscoderWorker.loadTranscoder('./basis_transcoder.js', './basis_transcoder.wasm');

    const app = new Application({
        backgroundColor : 0x1099bb,
        resizeTo        : window
    });

    document.body.appendChild(app.view as HTMLCanvasElement);

    Assets.add({ alias: 'png', src: 'spine/spineboy-png.skel', data: { spineSkeletonScale: 0.5 } });
    Assets.add({ alias: 'basis', src: 'spine/spineboy-basis.skel', data: { spineSkeletonScale: 0.5 } });

    await Assets.load(['png', 'basis']);

    const png = getSpine('png');

    png.position.set((app.screen.width / 2) - 200, app.screen.height - 100);
    png.state.setAnimation(0, 'walk', true);

    app.stage.addChild(png);

    const basis = getSpine('basis');

    basis.position.set((app.screen.width / 2) + 200, png.y);
    basis.state.setAnimation(0, 'walk', true);

    app.stage.addChild(basis);

    app.ticker.add(() =>
    {
        now = performance.now();

        const delta = now - then;

        png.update(delta * 0.0001);
        basis.update(delta * 0.0001);

        then = now;
    });
}

function getSpine(skeleton: string)
{
    const spine = new Spine(Assets.get(skeleton).spineData);

    return spine;
}

