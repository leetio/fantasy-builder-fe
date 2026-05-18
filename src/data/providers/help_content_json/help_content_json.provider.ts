import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {IHttpClientService} from "data/services/http";
import type {AxiosResponse} from "axios";

export interface IStaticContentPayload {
	locale: string;
	per_page: number;
}

export interface IStaticContent {
	page: number;
	previous_page: null;
	next_page: null;
	per_page: number;
	page_count: number;
	count: number;
	sort_by: string;
	sort_order: string;
}

export interface ISections extends IStaticContent {
	sections: {
		id: number;
		url: string;
		html_url: string;
		category_id: number;
		position: number;
		sorting: string;
		created_at: string;
		updated_at: string;
		name: string;
		description: string;
		locale: string;
		source_locale: string;
		outdated: boolean;
		parent_section_id: null;
		theme_template: string;
	}[];
}

export interface ICategories extends IStaticContent {
	categories: {
		id: number;
		url: string;
		html_url: string;
		position: number;
		created_at: string;
		updated_at: string;
		name: string;
		description: string;
		locale: string;
		source_locale: string;
		outdated: boolean;
	}[];
}

export interface IArticles extends IStaticContent {
	articles: {
		id: number;
		url: string;
		html_url: string;
		author_id: number;
		comments_disabled: boolean;
		draft: boolean;
		promoted: boolean;
		position: number;
		vote_sum: number;
		vote_count: number;
		section_id: number;
		created_at: string;
		updated_at: string;
		name: string;
		title: string;
		source_locale: string;
		locale: string;
		outdated: boolean;
		outdated_locales: unknown[];
		edited_at: string;
		user_segment_id: null;
		permission_group_id: number;
		label_names: string[];
		body: string;
	}[];
}

export interface IHelpContentJsonProvider {
	helpCategories(params: IStaticContentPayload): Promise<AxiosResponse<ICategories>>;
	helpSections(params: IStaticContentPayload): Promise<AxiosResponse<ISections>>;
	helpArticles(params: IStaticContentPayload): Promise<AxiosResponse<IArticles>>;
}

@injectable()
export class HelpContentJsonProvider implements IHelpContentJsonProvider {
	constructor(
		@inject(Bindings.ContentJsonHTTPClient) private _contentJsonClient: IHttpClientService
	) {}

	helpCategories = ({locale, ...params}: IStaticContentPayload) =>
		this._contentJsonClient.get<ICategories>(`${locale}/categories.json`, params);
	helpSections = ({locale, ...params}: IStaticContentPayload) =>
		this._contentJsonClient.get<ISections>(`${locale}/sections.json`, params);
	helpArticles = ({locale, ...params}: IStaticContentPayload) =>
		this._contentJsonClient.get<IArticles>(`${locale}/articles.json`, params);
}
