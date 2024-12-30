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
}

const initialState: ProducerState = {
	isMenuToggled: false,
	hasLoaded: false,
	currentScreen: Screen.StartScreen,
};

export const producer = createProducer(initialState, {
	toggleMenu: (state, toggled?: boolean) => ({ ...state, isMenuToggled: toggled ?? !state.isMenuToggled }),
	setScreen: (state, screen: ProducerState['currentScreen']) => ({ ...state, currentScreen: screen }),
	finishLoading: (state) => ({ ...state, hasLoaded: true }),
});

producer.subscribe((state) => {
	Vars.IsMenuOpened = state.isMenuToggled;
});

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;
