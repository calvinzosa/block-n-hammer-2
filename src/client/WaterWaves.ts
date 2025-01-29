import {
	AssetService,
	RunService,
	Workspace,
} from '@rbxts/services';

import cameraController from './Camera';

import 'shared/PLACEHOLDER/EditableAPI';
import { Content } from 'shared/PLACEHOLDER/Content';

import { setInterval } from 'shared/JS';

const waveHeight = 10;
const lqDistance = 100;
const checkInterval = 500;

const waterData = new Array<{ editableMesh: EditableMesh, water: MeshPart, faceVertices: Array<number>, vertexNormalized: Array<Vector2> }>();

setInterval(() => {
	const cameraPosition = cameraController.position;
	
	let i = 0;
	while (i < waterData.size()) {
		const { editableMesh, water } = waterData[i];
		
		if (water.GetClosestPointOnSurface(cameraPosition).sub(cameraPosition).Magnitude > lqDistance) {
			editableMesh.Destroy();
			waterData.remove(i);
			
			continue;
		}
		
		i++;
	}
	
	for (const water of Workspace.WaitForChild('Water').GetChildren()) {
		if (!water.IsA('MeshPart') || waterData.find(({ water: otherWater }) => otherWater === water) !== undefined) {
			continue;
		}
		
		if (water.GetClosestPointOnSurface(cameraPosition).sub(cameraPosition).Magnitude > lqDistance) {
			if (!water.FindFirstChild('LQWater')) {
				water.Transparency = 1;
				
				const lqWater = new Instance('Part');
				lqWater.Anchored = true;
				lqWater.CanCollide = false;
				lqWater.CFrame = water.CFrame;
				lqWater.Size = water.Size;
				lqWater.Transparency = 0.75;
				lqWater.Color = Color3.fromRGB(112, 168, 207);
				lqWater.CastShadow = false;
				lqWater.Name = 'LQWater';
				lqWater.Parent = water;
			}
			
			continue;
		}
		
		const editableMesh = AssetService.CreateEditableMesh({ });
		if (!editableMesh) {
			warn('Too much water loaded at once!');
			break;
		}
		
		if (water.Transparency === 1) {
			water.Transparency = 0.5;
			water.FindFirstChild('LQWater')?.Destroy();
		}
		
		const gridSize = new Vector2(water.Size.X, water.Size.Z).idiv(25);
		
		const faceVertices = new Array<number>();
		const vertexNormalized = new Array<Vector2>();
		
		for (const y of $range(0, gridSize.Y - 1)) {
			const normalizedY = math.map(y, 0, gridSize.Y - 1, -1, 1);
			
			for (const x of $range(0, gridSize.X - 1)) {
				const normalizedX = math.map(x, 0, gridSize.X - 1, -1, 1);
				
				const position = new Vector3(
					normalizedX,
					math.map(math.noise(normalizedX * 2, normalizedY * 2), -1, 1, 1 - (waveHeight * 2) / water.Size.Y, 1),
					normalizedY,
				);
				
				faceVertices.push(editableMesh.AddVertex(position));
				vertexNormalized.push(new Vector2(normalizedX, normalizedY));
			}
		}
		
		for (const y of $range(0, gridSize.Y - 2)) {
			for (const x of $range(0, gridSize.X - 2)) {
				const i = y * gridSize.X + x;
				
				editableMesh.AddTriangle(faceVertices[i + gridSize.X], faceVertices[i + 1], faceVertices[i]);
				editableMesh.AddTriangle(faceVertices[i + 1], faceVertices[i + gridSize.X], faceVertices[i + gridSize.X + 1]);
			}
		}
		
		const sideVertices = new Array<number>();
		
		for (const x of $range(0, gridSize.X - 1)) {
			const position = new Vector3(math.map(x, 0, gridSize.X - 1, -1, 1), -1, -1);
			
			sideVertices.push(editableMesh.AddVertex(position));
		}
		
		for (const x of $range(0, gridSize.X - 2)) {
			const vertex0 = faceVertices[x];
			const vertex1 = faceVertices[x + 1];
			const vertex2 = sideVertices[x];
			const vertex3 = sideVertices[x + 1];
			
			editableMesh.AddTriangle(vertex0, vertex1, vertex2);
			editableMesh.AddTriangle(vertex3, vertex2, vertex1);
		}
		
		for (const x of $range(-1, 1, 2)) {
			const sideVertices = new Array<number>();
			const shouldOffset = x === 1;
			const offsetIndex = shouldOffset ? gridSize.X - 1 : 0;
			
			for (const z of $range(0, gridSize.Y - 1)) {
				const position = new Vector3(x, -1, math.map(z, 0, gridSize.Y - 1, -1, 1));
				
				sideVertices.push(editableMesh.AddVertex(position));
			}
			
			for (const z of $range(0, gridSize.Y - 2)) {
				const vertex0 = faceVertices[offsetIndex + z * gridSize.X];
				const vertex1 = faceVertices[offsetIndex + (z + 1) * gridSize.X];
				const vertex2 = sideVertices[z];
				const vertex3 = sideVertices[z + 1];
				
				if (shouldOffset) {
					editableMesh.AddTriangle(vertex0, vertex1, vertex2);
					editableMesh.AddTriangle(vertex3, vertex2, vertex1);
				} else {
					editableMesh.AddTriangle(vertex2, vertex1, vertex0);
					editableMesh.AddTriangle(vertex1, vertex2, vertex3);
				}
			}
		}
		
		const color = editableMesh.AddColor(Color3.fromRGB(112, 168, 207), 255);
		
		for (const faceId of editableMesh.GetFaces() as Array<number>) {
			editableMesh.SetFaceColors(faceId, [color, color, color]);
		}
		
		const newMeshPart = AssetService.CreateMeshPartAsync(Content.fromObject(editableMesh));
		water.ApplyMesh(newMeshPart);
		
		waterData.push({ editableMesh, water, faceVertices, vertexNormalized });
	}
}, checkInterval);

RunService.Stepped.Connect((t) => {
	for (const { editableMesh, water, faceVertices, vertexNormalized } of waterData) {
		const offset = t / 2;
		
		for (const i of $range(0, faceVertices.size() - 1)) {
			const vertexId = faceVertices[i];
			const normalized = vertexNormalized[i];
			
			const newPosition = new Vector3(
				normalized.X,
				math.map(math.noise(normalized.X * 2 + offset, normalized.Y * 2 + offset), -1, 1, 1 - (waveHeight * 2) / water.Size.Y, 1),
				normalized.Y,
			);
			
			editableMesh.SetPosition(vertexId, newPosition);
		}
	}
});
