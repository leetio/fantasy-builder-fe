import {action, makeAutoObservable, observable} from "mobx";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {
	IChecksumsJsonProvider,
	TChecksums,
} from "data/providers/checksums_json/checksums_json.provider";
import {reduce} from "lodash-es";

export type {TChecksums} from "data/providers/checksums_json/checksums_json.provider";

export interface IChecksumStore {
	get checksums(): TChecksums;
	get changedChecksums(): TChecksums;

	fetchChecksums(): Promise<void>;
}

@injectable()
export class ChecksumStore implements IChecksumStore {
	@observable protected _checksums: TChecksums = {};
	@observable _changedChecksums: TChecksums = {};

	get checksums() {
		return this._checksums;
	}

	get changedChecksums() {
		return this._changedChecksums;
	}

	constructor(
		@inject(Bindings.ChecksumsJsonProvider) private _jsonProvider: IChecksumsJsonProvider
	) {
		makeAutoObservable(this);
	}

	@action
	async fetchChecksums(): Promise<void> {
		try {
			const {data} = await this._jsonProvider.checksums();
			this.saveChecksums(data);
		} catch (err) {
			console.error("Error while fetching checksums", err);
		}
	}

	@action
	private saveChecksums(checksums: TChecksums): void {
		this._changedChecksums = reduce(
			checksums,
			(acc, checksum, key) => {
				const oldChecksum = this._checksums[key];
				return checksum !== oldChecksum ? {...acc, [key]: checksum} : acc;
			},
			{}
		);

		this._checksums = checksums;
	}
}
