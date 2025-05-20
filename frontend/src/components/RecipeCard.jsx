import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function RecipeCard({
  title,
  image,
  onFavouriteButtonClick,
  onClick,
  isFavourite,
}) {
  return (
    <div
      onClick={onClick}
      className=" rounded-t-3xl flex md:w-[31%]  grow-1 md:max-w-[32%] md:min-h-[200px]  w-[100%] bg-[rgba(145,144,144,0.21)] flex-col mt-2   cursor-pointer  "
    >
      <img src={image} className="rounded-t-3xl w-[100%]" loading="lazy" />
      <div className="flex max-h-13 justify-between mb-2 ">
        <div
          className="ml-1 h-7 w-7 "
          onClick={(event) => {
            event.stopPropagation();
            onFavouriteButtonClick();
          }}
        >
          {isFavourite ? (
            <AiFillHeart
              className="w-[100%] h-[100%] "
              style={{ color: "red" }}
            />
          ) : (
            <AiOutlineHeart className=" w-[100%] h-[100%] " />
          )}
        </div>
        <h3 className=" font-extrabold w-[90%] md:text-xs truncate lg:text-sm ">
          {title}
        </h3>
      </div>
    </div>
  );
}

export default RecipeCard;
