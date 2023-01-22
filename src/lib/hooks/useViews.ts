import axios from "axios";
import { useEffect, useState } from "react";

export function useViews(deck_id: string) {
  const [views, setViews] = useState(0);

  useEffect(() => {
    axios
      .get(
        `https://collectivedeckcodes.goatcounter.com/counter//decks/${deck_id}.json`
      )
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        setViews(res.data.count_unique);
      })
      .catch(function (error) {
        console.log("No views found for " + deck_id);
      });
  }, []);

  return { views };
}
