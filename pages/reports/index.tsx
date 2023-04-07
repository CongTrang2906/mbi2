import React, { useEffect, useState } from "react";
import moment from "moment";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { User } from "@/model";
import { useRouter } from "next/router";
const Tables = () => {
  const [items, setItems] = useState<User[]>([]);
  const [date, setDate] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  // khởi tạo state của selected với giá trị là null có thể đảm bảo rằng khi component render lần đầu tiên,
  // giá trị của selected sẽ là null, cho đến khi người dùng chọn một phần tử cụ thể.
  const [selected, setSelected] = useState<{
    ID: null;
    FullName: null;
  } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pageSize, setPageSize] = useState(15);

  const router = useRouter();

  useEffect(() => {
    const pageSave = parseInt(localStorage.getItem("pageSize") || "15");
    setPageSize(pageSave);
  }, []);

  useEffect(() => {
    const getUsers = setTimeout(() => {
      getListUser();
      GetListDrop();
    }, 500);

    return () => {
      clearTimeout(getUsers);
    };
  }, [date, selected, pageSize]);

  useEffect(() => {
    getListUser();
  }, [page]);

  //Lists items
  const getListUser = () => {
    const id = selected ? selected.ID : "";
    fetch(
      `http://mbi.sapotacorp.vn/api/UserAPI/GetBAChuaBaoCaoData?BAID=${id}&month=${
        date ? moment(date).format("YYYY-MM-DD") : ""
      }&takeNum=${pageSize}&index=${page}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setItems(data.Data);
        setTotalPage(
          data.TotalItem % pageSize > 0 // Nếu tổng số mục không chia hết cho 10...
            ? Math.floor(data.TotalItem / pageSize) + 1 // ...thì thêm một trang nữa vào tổng số trang
            : Math.floor(data.TotalItem / pageSize)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //List user
  const GetListDrop = () => {
    fetch(`http://mbi.sapotacorp.vn/api/UserAPI/GetListBA`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // console.log(users);
  // ============================Onchange :Date==============================
  const handleDateChange = (e: any) => {
    setDate(e.target.value);
    setPage(1);
  };

  // ============================Onchange :Name==============================
  const handleNameChange = (e: any) => {
    setPage(1);
    if (e === "all") {
      //xóa giá trị của selected sau khi đã chọn một phần tử cụ thể, đặt lại giá trị của selected thành null.
      setSelected(null);
    }
    setSelected(e);
  };
  // ============================Onchange :PageSize==============================
  const handlePageSizeChange = (e: any) => {
    setPageSize(e.target.value);
    localStorage.setItem("pageSize", e.target.value.toString());
  };

  function classNames(...classes: String[]) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div className="relative sm:rounded-lg">
      <div className="w-10/12 m-auto text-sm  grid gap-2 mb-3 md:grid-cols-4">
        <div className=" pt-4 sm:px-6 lg:px-0 col-span-2 ">
          <h2 className="text-1xl font-bold tracking-tight text-gray-900">
            BA HAS NOT REPORTED
          </h2>
        </div>
        <div className="mt-3">
          <input
            className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  h-9 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="date"
            id="date"
            onChange={handleDateChange}
          />
        </div>

        <div>
          <Listbox value={selected} onChange={handleNameChange}>
            {({ open }) => (
              <div className="relative mt-3">
                <Listbox.Button
                  className="relative cursor-default bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-9 p-2  text-left dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for users"
                >
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">
                      {(selected && selected.FullName) || "Search for users"}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <Listbox.Option
                      key="all"
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value="all"
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              All
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                    {users?.map((person) => (
                      <Listbox.Option
                        key={person.ID}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={person}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 block truncate"
                                )}
                              >
                                {person.FullName}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-indigo-600",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
        </div>
      </div>

      <table className="w-10/12  m-auto  text-sm  text-gray-500 dark:text-gray-400 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-2 w-1">
              STT
            </th>
            <th scope="col" className="px-6 py-2 ">
              Report Time
            </th>
            <th scope="col" className="px-6 py-2 ">
              Full Name
            </th>
            <th scope="col" className="px-6 py-2  ">
              Total
            </th>
            <th scope="col" className="px-6 py-2  ">
              Total Miss
            </th>
            <th scope="col" className="px-6 py-2  ">
              Report Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {items?.map((p, index) => {
            const stt = (page - 1) * pageSize + index + 1;
            return (
              <tr
                //Lấy ID :
                // onClick={() => {
                //   router.push(`/reports/${p.ID}`);
                // }}
                key={p.ID}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-2  font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {stt}
                </th>
                <td className="px-6 py-2 text-cenFter">
                  {moment(p.ThoiGianBaoCao).format("DD-MM-YYYY")}
                </td>
                <td className="px-6 py-2">{p.FullName}</td>
                <td className="px-6 py-2 text-right">{p.Total}</td>
                <td className="px-6 py-2  text-right ">{p.TotalMiss}</td>
                <td className="px-6 py-2  text-right">
                  {parseFloat(p.TiLeBaoCao.replace(",", ".")).toFixed(2) + "%"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between items-center w-10/12 m-auto text-sm mt-2">
        <div className=" flex justify-center space-x-12 ">
          <div className="flex">
            <div className="flex justify-center items-center ">
              <label htmlFor="rows-per-page-select">Rows per page</label>
            </div>
            <div className="ml-2">
              <select
                className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block   h-9 pt-1 pb-1 pr-2 pl-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                // value={rowsPerPage}
                onChange={handlePageSizeChange}
                value={pageSize}
              >
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>
        </div>
        <div className="text-center ">
          <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px ">
              <li>
                <button
                  type="button"
                  onClick={(value) => {
                    setPage(page === 1 ? 1 : page - 1);
                  }}
                  className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </button>
              </li>
              {/* Array.from() để tạo ra một mảng mới với độ dài là totalPages */}
              {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                //pageIndex là trang tiếp theo
                (pageIndex) => (
                  <li
                    key={pageIndex}
                    onClick={() => {
                      //setPage(pageIndex) được gọi để cập nhật giá trị của biến trang hiện tại thành số trang được nhấp vào
                      setPage(pageIndex);
                    }}
                  >
                    <div
                      className={`px-3 py-2 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                        page === pageIndex
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-500 bg-white"
                      }`}
                    >
                      {pageIndex}
                    </div>
                  </li>
                )
              )}

              <li>
                <button
                  type="button"
                  onClick={(value) => {
                    setPage(page === totalPage ? totalPage : page + 1);
                  }}
                  className="px-3 py-2 leading-tight text-gray-600 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tables;
