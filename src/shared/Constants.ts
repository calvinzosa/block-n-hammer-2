export const ClickInputs = new Set<CastsToEnum<Enum.UserInputType>>([Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch]);

export namespace Attributes {
	export namespace Player {
		export const IsInStartScreen = 'IsInStartScreen';
		export const VoiceChatEnabled = 'VoiceChatEnabled';
	}
	
	export namespace UI {
		export const IsFrameOpened = 'IsFrameOpened';
	}
}

export namespace Tags {
	export const Cube = 'Cube';
}

export enum FontIds {
	Inter = 12187365364,
}

export interface SoundData {
	Id: string;
	PitchMin: number;
	PitchMax: number;
	Volume: number;
}

export const SoundsData = {
	GrassHit_Light: { Id: 'rbxassetid://98069158661569', PitchMin: 0.85, PitchMax: 1.2, Volume: 0.5 },
	GrassHit_Strong: { Id: 'rbxassetid://9114109952', PitchMin: 0.9, PitchMax: 1.2, Volume: 1 },
	PlasticHit_Light: { Id: 'rbxassetid://9117455448', PitchMin: 0.9, PitchMax: 1.1, Volume: 1.3 },
	PlasticHit_Strong: { Id: 'rbxassetid://9117520197', PitchMin: 0.6, PitchMax: 0.7, Volume: 1 },
	MetalHit_Light: { Id: 'rbxassetid://9116684733', PitchMin: 0.95, PitchMax: 1.2, Volume: 0.5 },
	MetalHit_Strong: { Id: 'rbxassetid://9116673678', PitchMin: 0.8, PitchMax: 1.1, Volume: 0.6 },
} satisfies Record<string, SoundData>;

export const AssetIds = [
	'rbxassetid://80028419934896', // block
	'rbxassetid://117201772657781', // block hammer 2 logo
	'rbxassetid://131641184474902', // circle white
	'rbxassetid://109276038017475', // customization icon
	'rbxassetid://94765382514882', // half pill
	'rbxassetid://99866759095083', // half rounded pill
	'rbxassetid://114536573005404', // half rounded pill left
	'rbxassetid://117052015783416', // half stretched circle (semicircle)
	'rbxassetid://86328009000728', // info button
	'rbxassetid://113163672569760', // inverted circle (square with circle cutout)
	'rbxassetid://113163672569760', // isosceles triangle
	'rbxassetid://127737643587374', // level selector icon
	'rbxassetid://84962674544300', // play_icon
	'rbxassetid://77737174735851', // roblox_default_face
	'rbxassetid://133464490130323', // rounded square top right (square with rounded corner only top right)
	'rbxassetid://94848656895620', // settings frame tabs
	'rbxassetid://76009150344164', // settings icon
	'rbxassetid://109002304737321', // spectate icon
	'rbxassetid://116118389947605', // start menu icon
	'rbxassetid://122481386733644', // tab button
	'rbxassetid://89115327216740', // tab button (1)
	'rbxassetid://126053120278617', // tileable lines pattern
	'rbxassetid://130568420000940', // upside-down half pill
	'rbxassetid://72623577668462', // upside-down half stretched circle
	'rbxassetid://124599294093527', // white square
	'rbxassetid://86463845756534', // grass blade
	'rbxassetid://83824641806203', // unknown texture
	SoundsData.GrassHit_Light.Id,
	SoundsData.GrassHit_Strong.Id,
	SoundsData.PlasticHit_Light.Id,
	SoundsData.PlasticHit_Strong.Id,
	SoundsData.MetalHit_Light.Id,
	SoundsData.MetalHit_Strong.Id,
];
