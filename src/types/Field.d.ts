export declare interface Field {
	name: string;
	value: string;
	buttons?: Button[];
	inline?: boolean;
}

export declare interface Button {
	text: string;
	url: string;
}

export declare interface FieldOption extends Field {
	prefix?: string;
	suffix?: string;
}