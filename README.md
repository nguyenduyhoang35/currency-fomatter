# currency-fomatter

```js 
import { CurrencyFormat } from "currency-fomatter"

export function Demo() {

	return (
			<CurrencyFormat />
	);
}
```

# prop

```js 
type Props = {
	value?: any;
	format: any;
	decimalScale: number;
	decimalSeparator: string;
	thousandSpacing: "2" | "2s" | "3" | "4";
	thousandSeparator: string | boolean;
	mask: string | string[];
	allowNegative: boolean;
	prefix: string;
	suffix: string;
	removeFormatting: any;
	fixedDecimalScale: boolean;
	isNumericString: boolean;
	isAllowed: any;
	onValueChange: any;
	onChange: any;
	onKeyDown: any;
	onMouseUp: any;
	onFocus: any;
	onBlur: any;
	type: "text" | "tel";
	displayType: "input" | "text";
	customInput: any;
	renderText: any;
};

```


