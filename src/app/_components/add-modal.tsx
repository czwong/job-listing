import Image from "next/image";
import Modal from "@/components/modal";
import { Props } from "@/components/modal";
import { svgFiles } from "@/lib/svg-loader";
import React, { useContext, useEffect, useState } from "react";
import { validateSite } from "@/lib/site-validation";
import { GlobalStateContext } from "../context/GlobalStateProvider";

enum Company {
  Google = "Google",
  Facebook = "Facebook",
  Amazon = "Amazon",
  Apple = "Apple",
  Microsoft = "Microsoft",
}

type AddModalProps = {
  loadJobListings: () => Promise<void>;
  onClose: () => void;
};

export default function AddModal({
  loadJobListings,
  onClose,
}: AddModalProps): JSX.Element {
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const {
    selectedCompany,
    setSelectedCompany,
    urlInput,
    setUrlInput,
    showAddModal,
    setShowAddModal,
  } = useContext(GlobalStateContext);

  const resetState = (): void => {
    setToggleDropdown(false);
    setSelectedCompany("Select Company");
    setUrlInput("");
  };

  const postJobListing = (): void => {
    const data = { companyName: selectedCompany, url: urlInput };

    fetch("/api/listing", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async () => {
        await loadJobListings();
        onClose();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!showAddModal) resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddModal]);

  return (
    <Modal
      isVisible={showAddModal}
      title={"Add Job Listing"}
      onClose={() => setShowAddModal(false)}
    >
      <div className="flex-col items-stretch p-4">
        <div className="flex mb-4">
          {svgFiles[selectedCompany] ? (
            <div className="m-auto">
              {svgFiles[selectedCompany]({
                width: 150,
                height: 150,
              })}
            </div>
          ) : (
            <Image
              className="rounded-md w-1/3 m-auto"
              src={
                "https://source.unsplash.com/blue-and-white-letter-b-9Zjd7PE_FRM"
              }
              width={100}
              height={100}
              alt=""
            />
          )}
          <div className="w-2/3 pl-4 flex-col">
            <button
              type="button"
              className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => setToggleDropdown(!toggleDropdown)}
            >
              <p>{selectedCompany}</p>
              <svg
                className="-mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {toggleDropdown && (
              <div
                className="absolute z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                {(Object.keys(Company) as Array<keyof typeof Company>).map(
                  (company, idx) => (
                    <div
                      className="py-1"
                      role="none"
                      key={idx}
                      onClick={() => {
                        setSelectedCompany(company);
                        setToggleDropdown(false);
                      }}
                    >
                      <button
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex={-1}
                        id="menu-item-0"
                      >
                        {company}
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute text-gray-500 flex items-center px-2 border-r h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-link"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />
              <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />
            </svg>
          </div>
          <input
            id="link"
            className="pr-24 text-gray-600 bg-gray-100 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-12 text-sm border-gray-300 rounded border"
            placeholder="https://google.com"
            value={urlInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setUrlInput((e.target as HTMLInputElement)?.value)
            }
            required
          />
          <button
            className="focus:ring-2 focus:ring-offset-2 rounded-md focus:ring-indigo-600 absolute right-0 top-0 transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none bg-indigo-700 rounded-r text-white px-5 h-10 text-sm"
            onClick={() => {
              if (validateSite(urlInput, selectedCompany)) postJobListing();
              else setFormError("");
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}
