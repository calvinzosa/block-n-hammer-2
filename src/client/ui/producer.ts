import { useProducer, UseProducerHook, useSelector, UseSelectorHook } from '@rbxts/react-reflex';
import { createProducer, InferState } from '@rbxts/reflex';
import Vars from 'client/Variables';

export enum Screen {
	StartScreen = 'StartScreen',
	Main = 'Main',
}

export interface ProducerState {
	isMenuToggled: boolean;
	hasLoaded: boolean;
	currentScreen: Screen;
	cube: {
		altitude: number;
		speed: number;
	};
	performance: {
		fps: number;
		ping: number;
	};
}

const initialState: ProducerState = {
	isMenuToggled: false,
	hasLoaded: false,
	currentScreen: Screen.StartScreen,
	cube: {
		altitude: 0,
		speed: 0,
	},
	performance: {
		fps: 0,
		ping: 0,
	},
};

export const guiProducer = createProducer(initialState, {
	ToggleMenu: (state, toggled?: boolean) => ({ ...state, isMenuToggled: toggled ?? !state.isMenuToggled }),
	SetScreen: (state, screen: ProducerState['currentScreen']) => ({ ...state, currentScreen: screen }),
	FinishLoading: (state) => ({ ...state, hasLoaded: true }),
	UpdateHUD: (state, altitude: number, speed: number) => ({ ...state, cube: { altitude, speed } }),
	UpdatePerformance: (state, fps: number, ping: number) => ({ ...state, performance: { fps, ping } }),
});

guiProducer.subscribe((state) => {
	Vars.IsMenuOpened = state.isMenuToggled;
});

export type RootProducer = typeof guiProducer;
export type RootState = InferState<RootProducer>;

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;
