import { FontAwesomeIcon } from "@/utils/utils";

export const rarityStars = (count: number) => {
  return Array(count)
    .fill("")
    .map((_, index) => (
      <FontAwesomeIcon key={index} name={"star"} size={12} color={"gold"} />
    ));
};
