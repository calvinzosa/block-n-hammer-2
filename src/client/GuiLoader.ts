import {
	ReplicatedFirst,
	Players,
} from '@rbxts/services';

const client = Players.LocalPlayer;
const playerGui = client.WaitForChild('PlayerGui') as PlayerGui;

const uiFolder = ReplicatedFirst.WaitForChild('UI');

uiFolder.ChildAdded.Connect((gui) => {
	if (playerGui.WaitForChild(gui.Name, 0.1) !== undefined) {
		return;
	}
	
	gui.Clone().Parent = playerGui;
});

for (const gui of uiFolder.GetChildren()) {
	if (playerGui.WaitForChild(gui.Name, 0.1) !== undefined) {
		continue;
	}
	
	gui.Clone().Parent = playerGui;
}
