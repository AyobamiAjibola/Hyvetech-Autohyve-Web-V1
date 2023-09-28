import moment from "moment";

export class Util {
  static formatDate(date: string, format?: string) {
    return moment(date).format(format || "DD-MM-YYYY");
  }

  static formAmount(amount: number | undefined, isKobo?: boolean) {
    if (!amount) return this.CurrencyDisplay(0);

    if (isKobo) {
      const convertedToKobo = (amount / 100).toFixed(2);
      return this.CurrencyDisplay(Number(convertedToKobo));
    }
    return this.CurrencyDisplay(amount);
  }

  static CurrencyDisplay = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

    return formattedAmount;
  };
  static CurrencyDisplayInKobo = (amount: number) => {
    const convertedToKobo = (amount / 100).toFixed(2);
    return this.CurrencyDisplay(Number(convertedToKobo));
  };
  static isValueInKoboOrNaira(amount: number) {
    if (amount < 100 || amount % 100 === 0) {
      return "Kobo";
    }
  }
  // const isKobo = this.isValueInKoboOrNaira(amount);
  //FIXME: this code was redundant. i replaced it with the CurrencyDisplay function
  // static formAmount(amount: number | undefined, isKobo?: boolean) {
  //   if (!amount) return `N 0.00`;
  //   if (isKobo) return `N ${(Number(amount) / 100).toFixed(2)}`;

  //   return `N ${Number(amount).toFixed(2)}`;
  // }
}
