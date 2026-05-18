import {identity, set} from "lodash-es";
import {SocialNetwork, ShareType, type Language} from "data/enums";
import {FACEBOOK_ID, GAME_SLUG, SHARE_URL} from "data/constants";

interface IGeneralShare {
	socialNetwork: SocialNetwork;
	type: ShareType.GENERAL;
	lang: Language;
	message?: string;
	leagueCode?: string;
}

interface ILeagueShare extends Omit<IGeneralShare, "type"> {
	type: ShareType.LEAGUE;
	leagueCode: string;
}

type TShare = IGeneralShare | ILeagueShare;

const TIMESTAMP_LENGTH_LIMIT = 9;
const getTimestamp = () => Date.now().toString().substring(TIMESTAMP_LENGTH_LIMIT);

const getEncodedJson = (object: Partial<TShare> & {t: string}) =>
	window.btoa(JSON.stringify(object));

export const getLinkForShare = (data: TShare) => {
	const params = {t: getTimestamp()};

	if (data.type === ShareType.LEAGUE) {
		set(params, "leagueCode", data.leagueCode);
	}

	return `${SHARE_URL}${data.lang}/${GAME_SLUG}/${data.type}/${getEncodedJson(params)}`;
};

const shareFB = (data: TShare) => {
	const isInvitesToLeague = data.type === ShareType.LEAGUE;
	const link = getLinkForShare(data);

	if (!FACEBOOK_ID) {
		const TWO_TIMES = 2;
		const winWidth = 626;
		const winHeight = 436;
		const winTop = window.screen.height / TWO_TIMES - winHeight / TWO_TIMES;
		const winLeft = window.screen.width / TWO_TIMES - winWidth / TWO_TIMES;

		window.open(
			`https://www.facebook.com/sharer/sharer.php?display=popup&u=${link}`,
			"_blank",
			`top=${winTop},left=${winLeft},width=${winWidth}, height=${winHeight},toolbar=0,status=0,scrollbars=no,resizable=1`
		);
		return;
	}

	window?.FB?.ui(
		{
			method: isInvitesToLeague ? "send" : "share",
			display: "popup",
			[isInvitesToLeague ? "link" : "href"]: link,
		},
		identity
	);
};

const shareTW = ({message = "", ...params}: TShare) =>
	window.open(
		"https://x.com/intent/tweet?url=" +
			encodeURIComponent(getLinkForShare(params)) +
			"&text=" +
			encodeURIComponent(message),
		"twitter-share-dialog",
		"width=626,height=436"
	);

const shareMobile = ({message = "", ...params}: TShare) => {
	void navigator
		.share({
			url: getLinkForShare(params),
			text: message,
		})
		.catch((_err) => {
			// Do nothing
		});
};

const callbacks = {
	[SocialNetwork.TWITTER]: shareTW,
	[SocialNetwork.FACEBOOK]: shareFB,
	[SocialNetwork.NATIVE]: shareMobile,
} as const;

export const share = (data: TShare) => callbacks[data.socialNetwork](data);
