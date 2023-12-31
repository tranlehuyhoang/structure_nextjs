import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";

export const GET = async (request) => {

  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  const page = parseInt(url.searchParams.get("page")) || 1; // Trang hiện tại, mặc định là 1
  const pageSize = parseInt(url.searchParams.get("pageSize")) || 3; // Kích thước trang, mặc định là 10

  try {
    await connect();

    const query = username ? { username } : {};

    // Tính toán chỉ mục bắt đầu và kết thúc của kết quả trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const count = await Post.countDocuments(query); // Tổng số bài viết phù hợp với truy vấn

    const posts = await Post.find(query)
      .skip(startIndex)
      .limit(pageSize)
      .exec();
    const totalPages = Math.ceil(count / pageSize); // Tổng số trang

    const response = {
      posts,
      page,
      pageSize,
      totalPages,
      totalCount: count,
    };

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();
  const newPost = new Post({
    title: body.title,
    slug: body.slug,
    desc: body.desc,
    img: body.img,
    content: body.content,
    username: body.username
  });

  try {
    await connect();

    await newPost.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
