export type BaseClientSetting = {
	Type: 'checkbox' | 'dropdown' | 'slider';
	Category: 'general' | 'camera' | 'quality' | 'movement' | 'ui';
	Label: string;
	Tip: string;
	Id: string;
};

export type ClientSetting = BaseClientSetting & (
	{
		Type: 'checkbox';
		Default: boolean;
	} | {
		Type: 'dropdown';
		Default: boolean;
		Options: Array<{
			Label: string;
			Value: string;
		}>;
	} | {
		Type: 'slider';
		Default: number;
		Decimals: number;
		Min: number;
		Max: number;
		Step: number;
	}
);

export const SettingEvents = {
	MouseReleased: new Array<() => void>(),
	MouseMoved: new Array<(x: number) => void>(),
	OnSettingChanged: new Array<(settingId: string, newValue: any) => void>(),
};

const ClientSettings = [
	{
		Type: 'slider',
		Label: 'FOV',
		Tip: 'test 1',
		Category: 'camera',
		Id: 'camera.fieldofview',
		Default: 70,
		Decimals: 0,
		Step: 5,
		Min: 40,
		Max: 120,
	},
	{
		Type: 'checkbox',
		Label: 'Enable Spring',
		Tip: 'test 2',
		Category: 'camera',
		Id: 'camera.spring',
		Default: false,
	},
	{
		Type: 'slider',
		Label: '^ Dampening',
		Tip: 'test 3',
		Category: 'camera',
		Id: 'camera.spring.dampening',
		Default: 0.5,
		Decimals: 1,
		Step: 0.1,
		Min: 0.2,
		Max: 1,
	},
] as Array<ClientSetting>;

export default ClientSettings;
