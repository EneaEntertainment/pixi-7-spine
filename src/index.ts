import 'pixi-spine';

import { Application, Assets, BatchRenderer, Sprite, extensions } from 'pixi.js';

import { BlendModesBatchRenderer } from '@enea-entertainment/pixi-blend-modes-batch';
import type { Renderer } from 'pixi.js';
import { Spine } from '@pixi-spine/runtime-4.1';
import { TranscoderWorker } from '@pixi/basis';

extensions.remove(BatchRenderer);
BlendModesBatchRenderer.extension.name = 'batch';
extensions.add(BlendModesBatchRenderer);

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
    Assets.add({ alias: 's1', src: 'spine/spineboy-png.png' });
    Assets.add({ alias: 's2', src: 'spine/spineboy-basis.basis' });

    await Assets.load(['png', 'basis', 's1', 's2']);

    const png = getSpine('png');

    png.position.set((app.screen.width / 2) - 200, app.screen.height - 100);
    png.state.setAnimation(0, 'walk', true);

    app.stage.addChild(png);

    const basis = getSpine('basis');

    basis.position.set((app.screen.width / 2) + 200, png.y);
    basis.state.setAnimation(0, 'walk', true);

    app.stage.addChild(basis);

    const s1 = getSprite('s1');

    s1.position.copyFrom(png.position);

    app.stage.addChild(s1);

    const s2 = getSprite('s2');

    s2.position.copyFrom(basis.position);

    app.stage.addChild(s2);

    const r = app.renderer as Renderer;

    console.warn(r.texture.managedTextures);

    app.ticker.add(() =>
    {
        now = performance.now();

        const delta = now - then;

        png.update(delta * 0.0001);
        basis.update(delta * 0.0001);

        then = now;
    });
}

function getSprite(textureName: string): Sprite
{
    const sprite = new Sprite(Assets.get(textureName));

    sprite.anchor.set(0.5);
    sprite.scale.set(0.5);
    sprite.blendMode = 1;

    return sprite;
}

function getSpine(skeleton: string)
{
    const spine = new Spine(Assets.get(skeleton).spineData);

    return spine;
}

