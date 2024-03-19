import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui";
import useDebounce from "@/hooks/useDebounce";
import { GridPostList, Loader } from "@/components/shared";
import { useGetPosts } from "@/lib/react-query/postQueries";
import { IPost } from "@/types";
import { useUserContext } from "@/context/AuthContex";
import { searchPosts } from "@/lib/api/postAPI";
import React from "react";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: IPost[];
  userId: string;
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
  userId,
}: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} userId={userId} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const { user } = useUserContext();
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [searchedPosts, setSearchedPosts] = useState<IPost[]>([]);
  const [isSearchFetching, setIsSearchFetching] = useState(false);

  const handleSearch = async (searchTerm: string) => {
    try {
      setIsSearchFetching(true);
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const posts = await searchPosts(encodedSearchTerm);
      setSearchedPosts(posts);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsSearchFetching(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);

  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const shouldShowSearchResults = debouncedSearch !== "";
  const shouldShowPosts =
    !shouldShowSearchResults && posts.pages.every((item) => item.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
            userId={user?.id}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          <>
            {posts.pages.map((postPage: IPost[], pageIndex: number) => (
              <React.Fragment key={`page-${pageIndex}`}>
                {postPage.map((post: IPost) => (
                  <GridPostList
                    key={post._id}
                    posts={[post]}
                    userId={user?.id}
                  />
                ))}
              </React.Fragment>
            ))}
          </>
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
