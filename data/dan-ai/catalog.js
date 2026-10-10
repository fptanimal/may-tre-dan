export default {
  "version": "1.0.0",
  "status": "visual_candidates_not_manufacturing_approval",
  "sources": [
    {
      "id": "report",
      "title": "Báo cáo dự án Đan Mây",
      "pages": [
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "scope": "Quy trình và nhóm ràng buộc; chưa có bảng giới hạn chế tác được xác minh."
    },
    {
      "id": "owner-rules-20261008",
      "title": "QUY_TAC_VA_CHECKLIST.md",
      "scope": "38 quy tắc và 49 mục kiểm tra do chủ dự án cung cấp."
    },
    {
      "id": "site-ui",
      "title": "Lựa chọn và gợi ý hiện có trên trang Đan AI",
      "scope": "Nhãn tham khảo, chưa phải hồ sơ kỹ thuật chuẩn hóa."
    },
    {
      "id": "concept-seed",
      "title": "Danh mục ứng viên minh họa được khai báo cho quy trình",
      "scope": "Giới hạn từ vựng tạo ảnh. Cấu tạo/tổ hợp là đề xuất, cần khách và nghệ nhân xác nhận."
    }
  ],
  "materials": [
    {
      "id": "rattan",
      "name": "Mây",
      "roles": [
        "weave",
        "frame"
      ],
      "sourceIds": [
        "report"
      ],
      "verified": false
    },
    {
      "id": "bamboo",
      "name": "Tre",
      "roles": [
        "weave",
        "frame"
      ],
      "sourceIds": [
        "report"
      ],
      "verified": false
    },
    {
      "id": "nua",
      "name": "Nứa",
      "roles": [
        "weave"
      ],
      "sourceIds": [
        "report"
      ],
      "verified": false
    },
    {
      "id": "giang",
      "name": "Giang",
      "roles": [
        "weave"
      ],
      "sourceIds": [
        "report"
      ],
      "verified": false
    },
    {
      "id": "song",
      "name": "Song",
      "roles": [
        "weave",
        "frame"
      ],
      "sourceIds": [
        "site-ui"
      ],
      "verified": false
    },
    {
      "id": "wood",
      "name": "Gỗ làm khung",
      "roles": [
        "frame"
      ],
      "sourceIds": [
        "concept-seed"
      ],
      "verified": false
    },
    {
      "id": "metal",
      "name": "Kim loại làm khung",
      "roles": [
        "frame"
      ],
      "sourceIds": [
        "concept-seed"
      ],
      "verified": false
    },
    {
      "id": "glass",
      "name": "Thủy tinh lót / gương",
      "roles": [
        "liner",
        "mirror"
      ],
      "sourceIds": [
        "concept-seed"
      ],
      "verified": false
    }
  ],
  "weaves": [
    {
      "id": "plain",
      "name": "Đan nong / lóng mốt (nhãn tham khảo)",
      "aliases": [
        "Đan nong",
        "Ring weave",
        "Anillo",
        "环编",
        "Кольцо"
      ],
      "visual": "Alternating over-under strips in perpendicular directions with continuous edges.",
      "verified": false,
      "referenceImage": null
    },
    {
      "id": "herringbone",
      "name": "Đan xương cá",
      "aliases": [
        "Đan xương cá",
        "Herringbone",
        "Espina de pescado",
        "人字编",
        "Елочка"
      ],
      "visual": "Consistent diagonal twill arranged into repeating herringbone rhythm.",
      "verified": false,
      "referenceImage": null
    },
    {
      "id": "openwork",
      "name": "Đan mắt cáo",
      "aliases": [
        "Đan mắt cáo",
        "Openwork",
        "Calado",
        "镂空编",
        "Ажурное"
      ],
      "visual": "Regular open lattice, connected strips, coherent bound edges.",
      "verified": false,
      "referenceImage": null
    },
    {
      "id": "slats",
      "name": "Đan nan (bố trí nan tham khảo)",
      "aliases": [
        "Đan nan",
        "Slats",
        "Listones",
        "网编",
        "Планки"
      ],
      "visual": "Parallel strips attached to supporting rails. Visual arrangement only; not a verified standard weave technique.",
      "verified": false,
      "referenceImage": null
    }
  ],
  "finishes": [
    {
      "id": "natural",
      "name": "Tự nhiên",
      "aliases": [
        "Tự nhiên",
        "Natural",
        "天然",
        "Натуральный"
      ]
    },
    {
      "id": "dyed",
      "name": "Nhuộm màu",
      "aliases": [
        "Nhuộm màu",
        "Dyed",
        "Teñido",
        "染色",
        "Окрашенный"
      ]
    },
    {
      "id": "lacquer",
      "name": "Sơn mài",
      "aliases": [
        "Sơn mài",
        "Lacquer",
        "Laca",
        "漆器",
        "Лак"
      ]
    }
  ],
  "shapes": [
    "round",
    "oval",
    "square",
    "rectangular",
    "teardrop",
    "cylinder",
    "dome",
    "sculptural"
  ],
  "colors": [
    "#8B4513",
    "#D2691E",
    "#DEB887",
    "#F5DEB3",
    "#A0522D",
    "#6B8E23",
    "#556B2F",
    "#DAA520",
    "#CD853F",
    "#FFFFFF",
    "#d4a373",
    "#5c4033",
    "#e9edc9"
  ],
  "products": [
    {
      "id": "chair",
      "name": "Ghế",
      "uses": [
        "seating"
      ],
      "shapes": [
        "round",
        "oval",
        "square",
        "rectangular",
        "sculptural"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork",
        "slats"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "song"
      ],
      "parts": [
        "seat",
        "back",
        "frame",
        "supports"
      ],
      "risks": [
        "load"
      ]
    },
    {
      "id": "swing",
      "name": "Xích đu",
      "uses": [
        "seating"
      ],
      "shapes": [
        "round",
        "oval",
        "teardrop"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork",
        "slats"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "song"
      ],
      "parts": [
        "seat",
        "back",
        "frame",
        "suspension",
        "support_base"
      ],
      "risks": [
        "load",
        "hanging"
      ]
    },
    {
      "id": "table",
      "name": "Bàn / bàn trà",
      "uses": [
        "table_surface"
      ],
      "shapes": [
        "round",
        "oval",
        "square",
        "rectangular"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork",
        "slats"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "song"
      ],
      "parts": [
        "top",
        "frame",
        "supports"
      ],
      "risks": [
        "load"
      ]
    },
    {
      "id": "basket",
      "name": "Giỏ / rổ",
      "uses": [
        "storage",
        "decoration",
        "food"
      ],
      "shapes": [
        "round",
        "oval",
        "square",
        "rectangular",
        "cylinder"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "nua",
        "giang",
        "song"
      ],
      "parts": [
        "base",
        "body",
        "rim"
      ],
      "risks": []
    },
    {
      "id": "lampshade",
      "name": "Chao đèn / đèn trang trí",
      "uses": [
        "lighting"
      ],
      "shapes": [
        "round",
        "oval",
        "cylinder",
        "dome",
        "teardrop",
        "sculptural"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork",
        "slats"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "nua",
        "giang"
      ],
      "parts": [
        "shade",
        "rim",
        "frame",
        "mount"
      ],
      "risks": [
        "electrical",
        "hanging"
      ]
    },
    {
      "id": "mirror",
      "name": "Gương trang trí",
      "uses": [
        "decoration"
      ],
      "shapes": [
        "round",
        "oval",
        "square",
        "rectangular",
        "sculptural"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork",
        "slats"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "song"
      ],
      "parts": [
        "woven_frame",
        "mirror",
        "mount"
      ],
      "risks": [
        "hanging"
      ]
    },
    {
      "id": "bag",
      "name": "Túi xách",
      "uses": [
        "carrying"
      ],
      "shapes": [
        "round",
        "oval",
        "square",
        "rectangular",
        "cylinder"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "nua",
        "giang"
      ],
      "parts": [
        "base",
        "body",
        "rim",
        "handles"
      ],
      "risks": []
    },
    {
      "id": "tray",
      "name": "Khay / mâm",
      "uses": [
        "storage",
        "food",
        "decoration"
      ],
      "shapes": [
        "round",
        "oval",
        "square",
        "rectangular"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "slats"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "nua",
        "giang"
      ],
      "parts": [
        "base",
        "rim"
      ],
      "risks": []
    },
    {
      "id": "vase",
      "name": "Bình / chậu trang trí",
      "uses": [
        "decoration",
        "water_container"
      ],
      "shapes": [
        "round",
        "oval",
        "cylinder",
        "sculptural"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "nua",
        "giang"
      ],
      "parts": [
        "base",
        "body",
        "rim"
      ],
      "risks": []
    },
    {
      "id": "shelf",
      "name": "Kệ",
      "uses": [
        "storage"
      ],
      "shapes": [
        "round",
        "square",
        "rectangular"
      ],
      "weaves": [
        "plain",
        "herringbone",
        "openwork",
        "slats"
      ],
      "materials": [
        "rattan",
        "bamboo",
        "song"
      ],
      "parts": [
        "shelves",
        "frame",
        "supports"
      ],
      "risks": [
        "load"
      ]
    }
  ],
  "verifiedLimits": [],
  "verifiedCompatibility": [],
  "workshopCapabilities": [],
  "verifiedEstimates": [],
  "candidateSourceId": "concept-seed"
};
