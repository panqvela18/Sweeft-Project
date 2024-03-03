import { cache } from "./Home";
import { useEffect, useRef, useState } from "react";
import api from "../Api/unsplash";

const History = () => {
  const [selected, setSelected] = useState<string>("");
  const [imageDetail, setImageDetail] = useState<UnsplashPhotoDetail | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleImageClick = async (imageId: string) => {
    const response = await api.get<UnsplashPhotoDetail>(`/photos/${imageId}`);
    setImageDetail(response.data);
    setShowModal(true);
  };

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
    <main className="flex">
      <ul className="w-1/4 min-h-screen bg-gray-700 p-5">
        <span className="block text-white font-semibold mb-2">
          PREVIOUS SEARCHES:
        </span>
        {Object.keys(cache).map((item) => {
          return (
            <li
              key={item}
              onClick={() => setSelected(item)}
              className="cursor-pointer text-white hover:text-gray-300 transition duration-300 ease-in-out"
            >
              {item}
            </li>
          );
        })}
      </ul>

      <div>
        {selected && (
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-5 w-[80%] justify-center mt-5">
              {cache[selected].data.map((photo: UnsplashPhoto) => {
                return (
                  <img
                    onClick={() => handleImageClick(photo.id)}
                    key={photo.id}
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                    className="rounded-md w-[100%] h-[300px] object-cover"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      {showModal && imageDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
          <div
            ref={modalRef}
            className="bg-white p-4 rounded-lg z-50 flex flex-col max-w-lg w-full"
          >
            <img
              className="w-full h-auto object-cover"
              src={imageDetail.urls.regular}
              alt={imageDetail.alt_description}
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="font-semibold text-gray-800">DOWNLOADS</span>
                <p>{imageDetail.downloads}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">LIKES</span>
                <p>{imageDetail.likes}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-800">VIEWS</span>
                <p>{imageDetail.views}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default History;
