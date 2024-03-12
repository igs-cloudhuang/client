import { _decorator, Component, Camera, view, screen, macro, renderer } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('CameraResize')
export class CameraResize extends Component {

    private camera = null as Camera;
    private hypotenuse = -1;

    onLoad() {
        this.camera = this.getComponent(Camera);
        // Bus.always(BusEvent.CanvasResize, this.onResize, this);
        view.on('canvas-resize', this.onResize, this);
    }

    onDestroy() {
        // Bus.cancel(BusEvent.CanvasResize, this.onResize, this);
        view.off('canvas-resize', this.onResize, this);
        this.camera = null;
    }

    start() {
        this.onResize();
    }

    onResize() {
        if (this.camera.projection === Camera.ProjectionType.ORTHO)
            this.orthoResize();
        else
            this.perspectiveResize();  // 修正攝影機的 FOV, 讓 3D 場景的寬度比例維持一致
    }

    private orthoResize() {
        let camera = this.camera;
        let winSize = screen.windowSize;
        camera.orthoHeight = winSize.height * Annin.Comm.config.screenScale / view.getScaleY() / 2;
    }

    private perspectiveResize() {
        let camera = this.camera;

        if (this.hypotenuse === -1)
            this.hypotenuse = Math.tan(camera.fov / 2 * macro.RAD);

        let designSize = view.getDesignResolutionSize();
        let aspect = designSize.width / designSize.height;
        let mag = 1;

        if (screen.windowSize.width / screen.windowSize.height <= aspect) {
            let w = screen.windowSize.width / screen.devicePixelRatio;
            let h = screen.windowSize.height / screen.devicePixelRatio;
            mag = w / (h * aspect);
        }

        let newHypotenuse = this.hypotenuse / mag;
        let newFov = Math.atan(newHypotenuse) * Annin.Comm.config.screenScale / macro.RAD * 2;
        camera.fovAxis = renderer.scene.CameraFOVAxis.VERTICAL;  // 固定垂直方向比例不變
        camera.fov = newFov;
    }

}
