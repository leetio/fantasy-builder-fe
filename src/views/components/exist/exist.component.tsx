import React, {Fragment, type PropsWithChildren} from "react";

type TProps = PropsWithChildren<{when: unknown}>;

export const Exist: React.FC<TProps> = ({when, children}) => (
	<Fragment>{when ? children : null}</Fragment>
);
