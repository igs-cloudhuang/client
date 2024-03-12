import { _decorator, Component, director, macro, mat4, Mat4, Node, Quat, quat, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

const tmp_mat = mat4();
const tmp_quat = quat();

@ccclass('billboard')
export class billboard extends Component {


    @property
    angle: number = 0;
    @property(Node)
    private cameraNd: Node = null;
    private rotMat: Mat4 = mat4();         // rotation matrix in this node space
    private rotAxis: Vec3 = v3(0, 0, 1);   // rotation axis in this node space
    private lastRot: number = 0;                 // rotation of 2D node

    start() {
        if (this.cameraNd === null)
            this.cameraNd = director.root.batcher2D.getFirstRenderCamera(this.node).node;
    }

    lateUpdate() {
        // camera & node 都可能發生移動或旋轉
        this.face2Camera();
    }

    private face2Camera() {
        if (this.angle !== this.lastRot) {
            this.rotMat.rotate(this.angle * macro.RAD, this.rotAxis);
            this.lastRot = this.angle;
        }

        this.cameraNd.getWorldMatrix(tmp_mat);
        tmp_mat.multiply(this.rotMat);
        tmp_mat.getRotation(tmp_quat);

        this.setWorldRotation(this.node, tmp_quat);
    }

    private setWorldRotation(node: Node, q: Quat) {
        if ((<any>node).setWorldRotation) {
            (<any>node).setWorldRotation(q);
        }
    }
}


