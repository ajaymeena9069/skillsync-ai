import Testimonial from "../models/Testimonial.js";

// @desc    Submit or update a testimonial
// @route   POST /api/testimonials
// @access  Private
export const submitTestimonial = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const userId = req.user._id;
    const role = req.user.role;

    if (!content || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please provide content and rating",
      });
    }

    // Check if user already submitted a testimonial
    let testimonial = await Testimonial.findOne({ userId });

    if (testimonial) {
      // Update existing
      testimonial.content = content;
      testimonial.rating = rating;
      await testimonial.save();
    } else {
      // Create new
      testimonial = await Testimonial.create({
        userId,
        content,
        rating,
        role,
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
      message: "Feedback submitted successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get top public testimonials for landing page
// @route   GET /api/testimonials/public
// @access  Public
export const getPublicTestimonials = async (req, res) => {
  try {
    // Get top 3 approved testimonials with 5-star rating
    const testimonials = await Testimonial.find({ isApproved: true, rating: 5 })
      .populate("userId", "name avatar role")
      .sort({ createdAt: -1 })
      .limit(3);

    // If we don't have enough 5-star, fallback to 4-star
    if (testimonials.length < 3) {
      const moreTestimonials = await Testimonial.find({
        isApproved: true,
        rating: 4,
      })
        .populate("userId", "name avatar role")
        .sort({ createdAt: -1 })
        .limit(3 - testimonials.length);
      testimonials.push(...moreTestimonials);
    }

    // Format for frontend
    const formattedTestimonials = testimonials.map((t) => {
      // Create a default job title/role text
      let roleText = t.role === "recruiter" ? "Tech Recruiter" : "Software Engineer";
      
      return {
        _id: t._id,
        name: t.userId?.name || "Anonymous User",
        role: roleText,
        avatar: t.userId?.avatar || (t.role === "recruiter" ? "👨‍💼" : "👨‍💻"),
        content: t.content,
        rating: t.rating,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedTestimonials,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
