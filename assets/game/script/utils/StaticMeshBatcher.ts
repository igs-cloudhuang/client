import { _decorator, BatchingUtility, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('StaticMeshBatcher')
export class StaticMeshBatcher extends Component {

    @property
    autoDestroyOnFinish = true;

    onLoad() {
        let newRoot = new Node(`${this.node.name}_Batched`);
        newRoot.layer = this.node.layer;
        newRoot.setParent(this.node.parent);
        newRoot.setSiblingIndex(this.node.getSiblingIndex());
        newRoot.setRTS(this.node.rotation, this.node.position, this.node.scale);

        let isDone = BatchingUtility.batchStaticModel(this.node, newRoot);
        if (!isDone) {
            console.error('[Error] Meshes batching failed.');
            newRoot.destroy();
            return;
        }

        if (this.autoDestroyOnFinish) {
            this.node.destroy();
        }
    }

}
