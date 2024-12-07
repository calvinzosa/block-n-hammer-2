export type BaseClientSetting = {
	Type: 'checkbox' | 'dropdown' | 'slider';
	Name: string;
	Id: string;
};

export type ClientSetting = BaseClientSetting & (
	{
		Type: 'checkbox';
		Default: boolean;
	} | {
		Type: 'dropdown';
		Default: boolean;
		Options: {
			Label: string;
			Value: string;
		}[];
	} | {
		Type: 'slider';
		Default: number;
		Min: number;
		Max: number;
		Step: number;
	}
);

const ClientSettings = [
	{
		Type: 'slider',
		Name: 'FOV',
		Id: 'camera.fieldofview',
		Default: 70,
		Step: 5,
		Min: 40,
		Max: 120,
	},
] as ClientSetting[];

export default ClientSettings;
