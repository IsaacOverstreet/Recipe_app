import { AiOutlineHeart } from "react-icons/ai";

function RecipeCard({
  title,
  image,
  onFavouriteButtonClick,
  onClick,
  isFavourite,
}) {
  return (
    <div onClick={onClick} className=" border border-solid cursor-pointer">
      <img src={image} className=" w-[300px]" />
      <div className="flex gap-2.5">
        <span
          onClick={(event) => {
            event.stopPropagation();
            onFavouriteButtonClick();
          }}
          className={isFavourite ? "text-red-500" : "text-white"}
        >
          <AiOutlineHeart />
        </span>
        <h3 className="rounded">{title}</h3>
      </div>
    </div>
  );
}

export default RecipeCard;
