import { Component, isValid, sp, UITransform, v2, v3, Vec2, warn, _decorator } from "cc";
import { JSB } from "cc/env";

const PI = 3.1415927;
const degRad = PI / 180;
const radDeg = 180 / PI

function cosDeg( degrees )
{
    return Math.cos( degrees * degRad );
};

function sinDeg( degrees )
{
    return Math.sin( degrees * degRad );
};

function localToWorldRotation( a, b, c, d, localRotation )
{
    let sin = sinDeg( localRotation ), cos = cosDeg( localRotation );
    return Math.atan2( cos * c + sin * d, cos * a + sin * b ) * radDeg;
}

const { ccclass, property, menu } = _decorator;

@ccclass
export default class SkeletonNodeFollow extends Component
{
    @property( {
        type: sp.Skeleton,
        tooltip: "目標 Spine 骨架"
    } )
    private m_spineSkeleton: sp.Skeleton = null;

    @property( {
        tooltip: "目標同步骨骼名稱"
    } )
    private m_boneName: string = "";

    @property( {
        tooltip: "是否快取旋轉及縮放的上層資料，預設開啟。如果父層以上會有動態調整旋轉及縮放則需取消勾選此選項，或是維持啟用狀態但於需要的時刻呼叫 CacheUpdate 方法"
    } )
    private m_isCacheData: boolean = false;

    @property( {
        tooltip: "是否同步位置"
    } )
    private m_isFollowPosition: boolean = false;

    @property( {
        tooltip: "是否同步旋轉"
    } )
    private m_isFollowRotation: boolean = false;

    @property( {
        tooltip: "是否將目標旋轉角度轉換成區域旋轉角度"
    } )
    private m_isRotationLocalization: boolean = false;

    @property( {
        tooltip: "是否同步縮放"
    } )
    private m_isFollowScale: boolean = false;

    @property( {
        tooltip: "是否將目標縮放量轉換成區域縮放量"
    } )
    private m_isScaleLocalization: boolean = false;

    @property( {
        visible: false
    } )
    private __boneIndex: number = 0;

    @property( {
        visible: true,
        displayName: "Preview"
    } )
    private m_preview: boolean = true;

    @property( {
        displayName: "Cache Ancestors",
        tooltip: "是否快取旋轉及縮放的上層資料，預設開啟。如果父層以上會有動態調整旋轉及縮放則需取消勾選此選項，或是維持啟用狀態但於需要的時刻呼叫 CacheUpdate 方法"
    } )
    private m_cacheAncestors: boolean = true;

    @property( {
        displayName: "Scale Factor",
        tooltip: "額外本體大小縮放",
        visible: function ()
        {
            return this.m_isFollowScale;
        }
    } )
    private m_scaleFactor: Vec2 = v2( 1, 1 );

    @property( {
        displayName: "Position Offset",
        tooltip: "額外本體位置偏移",
        visible: function ()
        {
            return this.m_isFollowPosition;
        }
    } )
    private m_positionOffset: Vec2 = v2( 0, 0 );

    @property( {
        displayName: "Rotation Factor",
        tooltip: "額外本體旋轉",
        visible: function ()
        {
            return this.m_isFollowRotation;
        }
    } )
    private m_rotationFactor: number = 0;

    private _oldAngle: number = 0;
    private _oldScaleX: number = 1;
    private _oldScaleY: number = 1;
    private _isCached: boolean = false;
    private _cachedRotation: number = 0;
    private _cachedScaleX: number = 1;
    private _cachedScaleY: number = 1;

    onLoad()
    {
        this._oldAngle = this.node.angle;
        this._oldScaleX = this.node.scale.x;
        this._oldScaleY = this.node.scale.y;
    }

    update()
    {

        if ( this.m_spineSkeleton && this.m_boneName != "" && ( this.m_isFollowPosition || this.m_isFollowRotation || this.m_isFollowScale ) )
        {
            let bone = null;
            if ( bone = this.m_spineSkeleton.findBone( this.m_boneName ) )
            {
                let angleFactor = 0;
                let scaleXFactor = 1;
                let scaleYFactor = 1;

                // 檢查是否已經 cache 過資料
                if ( !this.m_cacheAncestors || !this._isCached )
                {
                    // [還沒 cache 資料] => 計算旋轉及縮放資料
                    let spineAngle = 0;
                    let selfAngle = 0;

                    let spineScaleX = 1;
                    let spineScaleY = 1;
                    let selfScaleX = 1;
                    let selfScaleY = 1;

                    // 同步目標對象的旋轉及縮放資料
                    let parent = this.m_spineSkeleton.node;
                    while ( parent )
                    {
                        spineScaleX *= parent.scale.x;
                        spineScaleY *= parent.scale.y;
                        spineAngle += parent.angle;
                        parent = parent.parent;
                    }

                    // 自己的旋轉及縮放資料
                    parent = this.node.parent;
                    while ( parent )
                    {
                        selfScaleX *= parent.scale.x;
                        selfScaleY *= parent.scale.y;
                        selfAngle -= parent.angle;
                        parent = parent.parent;
                    }

                    // 計算轉換成自己的旋轉及縮放
                    this._cachedRotation = spineAngle + selfAngle;
                    this._cachedScaleX = spineScaleX / selfScaleX;
                    this._cachedScaleY = spineScaleY / selfScaleY;

                    // 標註 cache 完成
                    this._isCached = true;
                }

                // 取出旋轉及縮放資料
                angleFactor = this.m_isRotationLocalization ? this._cachedRotation : this._oldAngle;
                scaleXFactor = this.m_isScaleLocalization ? this._cachedScaleX : this._oldScaleX;
                scaleYFactor = this.m_isScaleLocalization ? this._cachedScaleY : this._oldScaleY;

                // 檢查是否啟用旋轉同步
                if ( this.m_isFollowRotation )
                {
                    // [啟用旋轉同步]
                    let parentBone = bone.parent;
                    let arotation = JSB ? bone.appliedRotation : bone.arotation;
                    if (arotation === undefined) arotation = 0;
                    this.node.angle = angleFactor +
                        (
                            !isValid( parentBone ) ?
                                bone.arotation :
                                localToWorldRotation( parentBone.a, parentBone.b, parentBone.c, parentBone.d, arotation )
                        )
                        + this.m_rotationFactor;
                }

                // 檢查是否啟用縮放同步
                if ( this.m_isFollowScale )
                {
                    // [啟用縮放同步]
                    this.node.setScale(scaleXFactor * bone.getWorldScaleX() * this.m_scaleFactor.x, scaleYFactor * bone.getWorldScaleY() * this.m_scaleFactor.y);
                }

                // 檢查是否啟用位置同步
                if ( this.m_isFollowPosition )
                {
                    // [啟用位置同步]
                    let worldPos = this.m_spineSkeleton.node.getComponent(UITransform).convertToWorldSpaceAR( v3( bone.worldX, bone.worldY ) );
                    let localPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR( worldPos );
                    // this.node.x = localPos.x;
                    // this.node.y = localPos.y;
                    // this.node.x += this.m_positionOffset.x;
                    // this.node.y += this.m_positionOffset.y;
                    this.node.setPosition( v3( localPos.x + this.m_positionOffset.x, localPos.y + this.m_positionOffset.y ) );
                }
            }
        }
    }

    onDestroy()
    {
        this._oldAngle = null;
        this._oldScaleX = null;
        this._oldScaleY = null;
        this._isCached = null;
        this._cachedRotation = null;
        this._cachedScaleX = null;
        this._cachedScaleY = null;
        this.m_spineSkeleton = null;
        this.m_boneName = null;
        this.m_cacheAncestors = null;
        this.m_isFollowPosition = null;
        this.m_isFollowRotation = null;
        this.m_isRotationLocalization = null;
        this.m_isFollowScale = null;
        this.m_isScaleLocalization = null;
    }

    /**
     * 要求重新計算快取資料
     */
    CacheUpdate()
    {
        this._isCached = false;
    }
}
