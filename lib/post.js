import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");


//mdファイルのデータを取り出す
export function getPostsData() {
    console.log("##getPostsData##");
    const fileNames = fs.readdirSync(postDirectory);
    const allPostData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/,""); //ファイル名(id)
        
        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        const matterResult = matter(fileContents);

        //idとデータを返す。
        return {
            id,
            ...matterResult.data,
        };

    }) ;
    return allPostData;
}

//getStaticPathでreturnで使うpathを取得する
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/,""),
            },
        };
    });

}

//idに基づいてブログ投稿データを返す
export async function getPostData(id) {
    const fullPath = path.join(postDirectory, `${id}.md`);
    const fileContent = fs.readFileSync(fullPath, "utf8");
   
    const matterResult = matter(fileContent);

    const blogContent = await remark().use(html).process(matterResult.content);

    const blogContentHTML = blogContent.toString();

    return {
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}