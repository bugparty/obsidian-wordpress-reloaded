/**
 * Sample post data for testing
 */

export const SAMPLE_MARKDOWN_POST = `---
title: Sample Blog Post
tags: [technology, tutorial]
status: draft
---

# Introduction

This is a sample blog post for testing purposes.

## Features

- Feature 1
- Feature 2
- Feature 3

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Conclusion

This is the end of the sample post.
`;

export const SAMPLE_POST_WITH_IMAGES = `---
title: Post with Images
---

# Image Gallery

Here's an image:

![Alt text](image.png)

And another one:

![Another image](https://example.com/image.jpg)
`;

export const SAMPLE_POST_WITH_MATH = `---
title: Math Post
---

# Mathematical Formulas

Inline math: $E = mc^2$

Block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`;

export const SAMPLE_POST_MINIMAL = `---
title: Minimal Post
---

Just a simple post with minimal content.
`;

export const SAMPLE_POST_NO_FRONTMATTER = `# Post Without Frontmatter

This post doesn't have YAML frontmatter.

It should still be publishable with default settings.
`;

export const SAMPLE_POST_COMPLEX_FRONTMATTER = `---
title: Complex Post
tags: [test, demo, tutorial]
categories: [Development, Testing]
status: publish
excerpt: This is a custom excerpt
featured_image: https://example.com/featured.jpg
post_date: 2024-01-15
custom_field: custom_value
---

# Complex Post

This post has complex frontmatter with various fields.
`;
