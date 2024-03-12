
import { LicenseID, GetSetting } from "./LicenseSetting";

/**
 * 檢查SwitchOff設定是否符合license
 * @param licenseID 使用的license
 * @param serverSwitchList 平台提供的的SwitchOff設定
 * @returns 檢查過的SwitchOff設定
 */
export function CheckSwitchOff( licenseID: number, serverSwitchList: number[] ): number[]
{
    if ( licenseID > LicenseID.None )
    {
        let setting: number[] = GetSetting(licenseID );
        setting.forEach( ( value: number ) =>
        {
            if ( !serverSwitchList.includes( value ) )
            {
                serverSwitchList.push( value );
            }
        } );
    }
    return serverSwitchList;
}