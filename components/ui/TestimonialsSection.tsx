import { supabase } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

interface Testimonial {
  id: string;
  rating: number;
  review: string;
  profile: {
    fullName: string;
    avatar: string | null;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View className="flex-row mt-1">
      {[...Array(5)].map((_, i) => (
        <FontAwesome
          key={i}
          name={i < rating ? "star" : "star-o"}
          size={14}
          color="#facc15"
        />
      ))}
    </View>
  );
}

export const TestimonialsSection = ({ propertyId }: { propertyId: string }) => {
  const [testimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, review, profile:profiles(full_name, avatar_url)")
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        // setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, [propertyId]);

  return (
    <View className="mt-4">
      {testimonials.length === 0 ? (
        <Text className="text-gray-500">No testimonials available</Text>
      ) : (
        testimonials.map((item) => (
          <View key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Image
                source={
                  item.profile?.avatar
                    ? { uri: item.profile.avatar }
                    : require("@/assets/images/Andrew.png")
                }
                className="w-10 h-10 rounded-full"
              />
              <View className="ml-3">
                <Text className="text-sm font-bold text-black">
                  {item.profile?.fullName ?? "Anonymous"}
                </Text>
                <StarRating rating={item.rating} />
              </View>
            </View>
            <Text className="text-sm text-gray-700">
              {item.review.length > 120 ? (
                <>
                  {item.review.slice(0, 120)}...
                  <Text className="text-[#92E3A9]"> see more</Text>
                </>
              ) : (
                item.review
              )}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};
