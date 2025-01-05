import {
	HttpService,
} from '@rbxts/services';

import { RepositoryDetails, ReleaseData } from './Types';

export class GitHubAPI {
	static repositoryDetails: RepositoryDetails = {
		owner: 'calvinzosa',
		name: 'block-n-hammer-2',
	};
	
	static getCurrentRelease() {
		try {
			const url = `https://api.github.com/repos/${GitHubAPI.repositoryDetails.owner}/${GitHubAPI.repositoryDetails.name}/releases/latest`;
			const result = HttpService.JSONDecode(HttpService.GetAsync(url)) as ReleaseData;
			
			return [true, result] as [true, ReleaseData];
		} catch (err) {
			return [false, err] as [false, unknown];
		}
	}
}
