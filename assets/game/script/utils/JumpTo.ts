import { Node, Tween, Vec3, tween } from 'cc';

const empty_obj = {};

function bezier2(C1: number, C2: number, C3: number, t: number): number {
    const t1 = 1 - t, tt = t * t;
    return t1 * t1 * C1 + 2 * t * t1 * C2 + tt * C3;
}

export function jumpTo<T extends Node>(target: T, duration: number, from: Vec3, to: Vec3, jumpHeight: number): Tween<T> {
    let mid_x = (from.x + to.x) * .5;
    let mid_y = (from.y + to.y) * .5 + jumpHeight;
    return tween(target).by(duration, empty_obj, {
        onUpdate: (_, t) => {
            target.setPosition(
                bezier2(from.x, mid_x, to.x, t),
                bezier2(from.y, mid_y, to.y, t)
            );
        }
    });
}