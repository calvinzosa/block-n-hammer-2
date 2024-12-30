import {
	ReplicatedStorage,
	Workspace,
} from '@rbxts/services';
import { setTimeout } from 'shared/JS';

import { destroyAfter, randomInt } from 'shared/Utils';

const templateEffectsFolder = ReplicatedStorage.WaitForChild('Templates').WaitForChild('Effects') as Folder;
const effectsFolder = Workspace.WaitForChild('Effects');

let hammerEffectDebounce = false;

export function hammerHitMaterial(material: CastsToEnum<Enum.Material>, impactPoint: Vector3, normal: Vector3, strength: number) {
	if (hammerEffectDebounce) {
		return;
	}
	
	hammerEffectDebounce = true;
	setTimeout(() => hammerEffectDebounce = false, 100);
	
	print(strength);
	if (strength > 120) {
		
		
		return;
	}
	
	switch (material) {
		case Enum.Material.Grass: {
			break;
		}
		case Enum.Material.Plastic: {
			break;
		}
	}
	if (material === Enum.Material.Plastic) {
	} else if (material === Enum.Material.Grass) {
		if (strength > 30) {
			print('strong');
		} else {
			const effect = templateEffectsFolder.WaitForChild('GrassHit_0').Clone() as Part & { ParticleEmitter: ParticleEmitter };
			effect.CFrame = CFrame.lookAlong(impactPoint, normal);
			effect.Parent = Workspace;
			
			effect.ParticleEmitter.Emit(randomInt(20, 30));
			
			destroyAfter(effect, 2_000);
		}
	}
}
