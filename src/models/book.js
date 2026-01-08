import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    validator:{
        function (value) {
            if (value.length>30) {
                throw new Error("Title should be less than 30 characters");
            }
            return true;
        }
    }
  },
  author: {
    type: String,
    required: true,
    validator:{
        function (value) {
            if (value.length>20) {
                throw new Error("Author should be less than 30 characters");
            }
            return true;
        }
    }
  },
  subject: {
    type: String,
    required: true,
    validator:{
        function (value) {
            if (value.length>20) {
                throw new Error("Subject should be less than 30 characters");
            }
            return true;
        }
    }
  },
  description: {
    type: String,
    required: true,
    validator:{
        function (value) {
            if (value.length>100) {
                throw new Error("Description should be less than 100 characters");
            }
            return true;
        }
    }
  },
  semester: {
    type: String,
    required: true,
    validator:{
        function (value) {
            if (!validator.isAlpha(value)) {
                throw new Error("Invalid Semester");
            }
            return true;
        }
    }
  },
  category: {
    type: String,
    required: true,
    validator: {
      function(value) {
        const ALLOWED_CATEGORY = ["book", "notes"];
        if (!ALLOWED_CATEGORY.includes(value)) {
          throw new Error("Invalid Category");
        }
      },
    },
  },
  condition: {
    type: String,
    required: true,
    validator: {
      function(value) {
        const ALLOWED_CONDITION = ["fair", "good", "poor"];
        if (!ALLOWED_CONDITION.includes(value)) {
          throw new Error("Invalid Condition");
        }
      },
    },
  },

  price: {
    type: Number,
    required: true,
    validator:{
        function (value) {
            if (value < 0) {
                throw new Error("Invalid Price");
            }
            return true;
        }
    }
  },

  bookImg: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default:"Available",
    validator : {
        function (value) {
            const ALLOWED_STATUS=["Available","sold"]
            if (!ALLOWED_STATUS.includes(value)) {
                throw new Error("Invalid Status");
            }
            return true;
        }
    }
  },
  sellerId:{
    type: mongoose.Types.ObjectId,
    ref:"User",
    required:true
  }
});
bookSchema.methods.getPrice = function (mrp) {
  const mapPrice = {
    fair: 0.3,
    good: 0.4,
    poor: 0.2,
  };
  return mrp * (mapPrice[this.condition] || 0.3);
};
const bookModel = mongoose.model("Book", bookSchema);
export default bookModel;
