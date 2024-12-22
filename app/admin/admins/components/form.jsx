"use client";

import { getAdmin } from "@/lib/firestore/admins/read_server";

import { createNewAdmin, updateAdmin } from "@/lib/firestore/admins/write";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Form() {
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  // Defining functionality
  const fetchData = async () => {
    try {
      const res = await getAdmin({ id: id });
      if (!res) {
        toast.error("Admins not found");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((preData) => {
      return { ...(preData ?? {}), [key]: value };
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewAdmin({ data: data, image: image });
      toast.success("Successfully Created");

      // Reset the form state
      setData(null);
      setImage(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateAdmin({ data: data, image: image });
      toast.success("Successfully Updated");

      // Reset the form state
      setData(null);
      setImage(null);
      router.push(`/admin/admins`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Admin</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-image" className="text-gray-500 text-sm">
            Image <span className="text-red-600">*</span>
          </label>
          {image && (
            <div className="flex justify-center items-center p-3">
              <img className="h-20" src={URL.createObjectURL(image)} alt="" />
            </div>
          )}
          <input
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setImage(e.target.files[0]);
              }
            }}
            id="admin-image"
            name="admin-image"
            type="file"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-name" className="text-gray-500 text-sm">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="admin-name"
            name="admin-name"
            type="text"
            value={data?.name ?? ""}
            onChange={(e) => {
              handleData("name", e.target.value);
            }}
            placeholder="Enter name"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="admin-email" className="text-gray-500 text-sm">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="admin-email"
            name="admin-email"
            type="email"
            value={data?.email ?? ""}
            onChange={(e) => {
              handleData("email", e.target.value);
            }}
            placeholder="Enter email"
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            required
          />
        </div>

        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          className="mt-3"
        >
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}
