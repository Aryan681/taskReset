import { Client } from "@notionhq/client";

const notion = new Client({
 auth: process.env.NOTION_TOKEN,,
});

// This is the Quote block that contains ALL Daily Goal todos
const DAILY_GOAL_CONTAINER =
  "284f144d-ef57-80c0-86c5-fcffbc92a066";

let total = 0;
let reset = 0;

async function getChildren(blockId) {
  let blocks = [];
  let cursor = undefined;

  while (true) {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    blocks.push(...res.results);

    if (!res.has_more) break;

    cursor = res.next_cursor;
  }

  return blocks;
}

async function resetTodos(blockId) {
  const children = await getChildren(blockId);

  for (const block of children) {
    if (block.type === "to_do") {
      total++;

      const text = block.to_do.rich_text
        .map((t) => t.plain_text)
        .join("");

      if (block.to_do.checked) {
        console.log("Resetting:", text);

        await notion.blocks.update({
          block_id: block.id,
          to_do: {
            rich_text: block.to_do.rich_text,
            checked: false,
            color: block.to_do.color,
          },
        });

        reset++;
      }
    }

    if (block.has_children) {
      await resetTodos(block.id);
    }
  }
}

(async () => {
  try {
    console.log("Resetting Daily Goal...");
    console.log("--------------------------------");

    await resetTodos(DAILY_GOAL_CONTAINER);

    console.log("--------------------------------");
    console.log("Todos Found :", total);
    console.log("Reset :", reset);
    console.log("Done.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
