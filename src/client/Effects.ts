import {
	ReplicatedStorage,
	TweenService,
	Workspace,
} from '@rbxts/services';

import { destroyAfter, randomFloat, randomInt, randomUnitVector, randomVector } from 'shared/Utils';
import { setTimeout } from 'shared/JS';

const templateEffectsFolder = ReplicatedStorage.WaitForChild('Templates').WaitForChild('Effects') as Folder;
const effectsFolder = Workspace.WaitForChild('Effects');

let hammerEffectDebounce = false;

type EffectPart = Part & {
	ParticleEmitter: ParticleEmitter;
}

export function hammerHitMaterial(part: BasePart, impactPoint: Vector3, normal: Vector3, strength: number) {
	if (strength < 0 || hammerEffectDebounce || part.IsA('Terrain')) {
		return;
	}
	
	hammerEffectDebounce = true;
	setTimeout(() => hammerEffectDebounce = false, 100);
	
	if (strength > 100) {
		return;
	}
	
	let effect: EffectPart | undefined = undefined;
	let effectAmount = 0;
	let createParticles = false;
	
	switch (part.Material) {
		case Enum.Material.Grass: {
			if (strength > 10) {
				effect = templateEffectsFolder.WaitForChild('GrassHit_0').Clone() as EffectPart;
				effectAmount = randomInt(100, 200);
				
				if (strength > 30) createParticles = true;
			}
			
			break;
		}
	}
	
	if (effect === undefined) {
		effect = templateEffectsFolder.WaitForChild('Unknown_0').Clone() as EffectPart;
		effectAmount = 20;
	}
	
	destroyAfter(effect, 2_000);
	
	effect.CFrame = CFrame.lookAlong(impactPoint, normal);
	effect.Parent = effectsFolder;
	effect.ParticleEmitter.Emit(effectAmount);
	
	if (createParticles) {
		let totalParticles = randomInt(10, 20);
		
		let minSize = new Vector3(0.1, 0.1, 0.1);
		let maxSize = new Vector3(2, 2, 2);
		
		let minVelocity = 30;
		let maxVelocity = 60;
		
		let minDuration = 0.5;
		let maxDuration = 1.5;
		
		const particlePart = new Instance('Part');
		particlePart.Color = part.Color;
		particlePart.Material = part.Material;
		particlePart.MaterialVariant = part.MaterialVariant;
		particlePart.CollisionGroup = 'Debris';
		particlePart.Position = impactPoint;
		particlePart.TopSurface = particlePart.BottomSurface = Enum.SurfaceType.Smooth;
		
		const parts = new Array<Part>();
		
		destroyAfter(parts, maxDuration * 1_000);
		
		for (const _i of $range(1, totalParticles)) {
			const size = randomVector(minSize, maxSize);
			const duration = randomFloat(minDuration, maxDuration);
			
			const clone = particlePart.Clone();
			clone.Size = size;
			clone.AssemblyLinearVelocity = randomUnitVector().mul(randomFloat(minVelocity, maxVelocity));
			clone.Parent = effectsFolder;
			
			TweenService.Create(clone, new TweenInfo(duration, Enum.EasingStyle.Linear, Enum.EasingDirection.In, 0, false, 0), {
				LocalTransparencyModifier: 1,
			}).Play();
			
			parts.push(clone);
		}
	}
}
