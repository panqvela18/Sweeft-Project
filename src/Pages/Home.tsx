import { FormEvent, useEffect, useState, useRef } from "react";
import api from "../Api/unsplash";
import "../App.css";

export const cache: any = {};

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [popularImages, setPopularImages] = useState<UnsplashPhoto[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loader, setLoader] = useState<boolean>(false);
  const [imageDetail, setImageDetail] = useState<UnsplashPhotoDetail | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const fromCache = useRef<boolean>(false);

  console.log(imageDetail);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
      setLoader(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetch20PopularImages = async () => {
    const response = await api.get("/photos", {
      params: {
        order_by: "popular",
        per_page: 20,
      },
    });
    setPopularImages(response.data);
  };

  const getImages = async () => {
    if (searchValue === "") return;
    const response = await api.get("/search/photos", {
      params: {
        query: searchValue,
        per_page: 20,
        page: page,
      },
    });
    setPopularImages((prev) => [...prev, ...response.data.results]);
    // if (!historyInputs.includes(searchValue)) {
    //   setHistoryInputs((prev) => [...prev, searchValue]);
    // }
    if (searchValue in cache) {
      cache[searchValue] = {
        data: { ...cache[searchValue].data, ...response.data.results },
        page,
      };
    } else {
      cache[searchValue] = { data: [...response.data.results], page: 1 };
    }

    setLoader(false);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleImageClick = async (imageId: string) => {
    const response = await api.get<UnsplashPhotoDetail>(`/photos/${imageId}`);
    setImageDetail(response.data);
    setShowModal(true);
  };

  const checkCache = () => {
    if (searchValue in cache) {
      setPopularImages(cache[searchValue].data);
      setPage(cache[searchValue].page);
      fromCache.current = true;
      return true;
    }
    return false;
  };

  useEffect(() => {
    fetch20PopularImages();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (!checkCache()) {
        getImages();
      }
    }, 500);
    return () => {
      clearTimeout(timeOut);
    };
  }, [searchValue]);

  useEffect(() => {
    if (fromCache.current) {
      fromCache.current = false;
      return;
    }
    getImages();
  }, [page]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main>
      <form className="flex items-center justify-center" onSubmit={submit}>
        <input
          className="border w-[500px] h-10 mt-10 outline-none p-3 text-2xl"
          type="text"
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
            setPopularImages([]);
          }}
          autoFocus
        />
      </form>
      <div className="grid grid-cols-4 gap-4 m-6">
        {popularImages &&
          popularImages.map((image) => {
            return (
              <img
                onClick={() => handleImageClick(image.id)}
                key={image.id}
                className="w-[400px] h-[400px] object-cover"
                src={image.urls.regular}
                alt={image.alt_description}
              />
            );
          })}
      </div>
      {showModal && imageDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-lg z-50 flex flex-col"
          >
            <img
              className="w-[300px] h-[300px] object-cover"
              src={imageDetail.urls.regular}
              alt={imageDetail.alt_description}
            />
            <div className="flex items-center justify-between">
              <div>
                <span className="font-[16px]">DOWNLOADS</span>
                <p>{imageDetail.downloads}</p>
              </div>
              <div>
                <span className="font-[16px]">LIKES</span>
                <p>{imageDetail.likes}</p>
              </div>
              <div>
                <span className="font-[16px]">VIEW</span>
                <p>{imageDetail.views}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchValue !== "" && loader && (
        <div className="flex items-center justify-center">
          <svg viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
          </svg>
        </div>
      )}
    </main>
  );
}
