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
	cubeAltitude: number;
	cubeSpeed: number;
}

const initialState: ProducerState = {
	isMenuToggled: false,
	hasLoaded: false,
	currentScreen: Screen.StartScreen,
	cubeAltitude: 0,
	cubeSpeed: 0,
};

export const guiProducer = createProducer(initialState, {
	ToggleMenu: (state, toggled?: boolean) => ({ ...state, isMenuToggled: toggled ?? !state.isMenuToggled }),
	SetScreen: (state, screen: ProducerState['currentScreen']) => ({ ...state, currentScreen: screen }),
	FinishLoading: (state) => ({ ...state, hasLoaded: true }),
	UpdateHUD: (state, cubeAltitude: number, cubeSpeed: number) => ({ ...state, cubeAltitude: cubeAltitude, cubeSpeed: cubeSpeed }),
});

guiProducer.subscribe((state) => {
	Vars.IsMenuOpened = state.isMenuToggled;
});

export type RootProducer = typeof guiProducer;
export type RootState = InferState<RootProducer>;

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;
