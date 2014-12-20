---
layout: post
title:  "Spelling corrector in Haskell"
date:   2014-12-18 21:35:46
categories: Haskell
---

There are very few articles that every now and then keep coming up on Hacker News. One of them is Peter Norvig's [How to Write a Spelling Corrector](http://norvig.com/spell-correct.html).
For those of you who don't know Peter Norvig, he's a really smart guy who also happens to be Director of Research at Google.

Having recently started learning Haskell, I decided to take over the challenge of re-implementing his spelling corrector.  
One imporant thing to say is that, since there seems to be a leaderboard on Peter Norvig's website for the shortest implementations, I wrote this code trying to come up with the possible shortest version, putting *brevity over readability*, which is something I usually never do. But hey, sometimes we don't want to be too serious and it's just **FUN**!  
Now, let me say that Python is a very nice language and a lot of people love it because it looks like pseudo-code and it's really easy to prototype in it. That's probably the main reason I still believe his version is better than mine, more readable yet even shorter.

Here's my take:

{% highlight haskell linenos %}
import           Data.Char (toLower, isAlpha)
import           Data.List (sortBy)
import qualified Data.ByteString.Char8 as B
import qualified Data.Map.Lazy as M
import qualified Data.Set as S

alphabet = "abcdefghijklmnopqrstuvwxyz"
nWords = B.readFile "big.txt" >>= \ws -> return (train (lowerWords (B.unpack ws)))
lowerWords = filter (not . null) . map (map toLower . filter (isAlpha )) . words
train = foldr (\ x acc -> M.insertWith (+) x 1 acc) M.empty

edits1 w = S.fromList $ deletes w ++ transposes w ++ replaces w ++ inserts w
  where splits s = [ splitAt n s | n <- [0..((length s) - 1)] ]
        deletes = (map (\(a, b) -> a ++ (tail b))) . splits
        transposes w = [ a ++ [b !! 1] ++ [b !! 0] ++ (drop 2 b) | (a,b) <- splits w , length b > 1 ]
        replaces w = [a ++ [c] ++ (tail b) | (a,b) <- splits w , c <- alphabet]
        inserts w = [a ++ [c] ++ b | (a,b) <- splits w , c <- alphabet]
edits2 w = S.foldr (S.union) S.empty (S.map edits1 (edits1 w))
knownEdits2 w nwords = (edits2 w) `S.intersection` (M.keysSet nwords)
known inputSet nwords = inputSet `S.intersection` (M.keysSet nwords)

choices w ws = (known (S.singleton w) ws) `orNextIfEmpty` (known (edits1 w) ws)  `orNextIfEmpty` (knownEdits2 w ws) `orNextIfEmpty` (S.singleton w)
  where orNextIfEmpty x y = if S.null x then y else x

chooseBest ch ws = chooseBest' (ws `M.intersection` (M.fromList (map (\x -> (x,0)) (S.toList ch))))
  where chooseBest' bestChs = head $ (map fst (sortCandidates bestChs))
        sortCandidates = (sortBy (\(_,c1)(_,c2) -> c2 `compare` c1)) . M.toList

correct w = nWords >>= \ws -> return (chooseBest (choices w ws) ws)
{% endhighlight %}

I am not going to explain the algorithm, since you can read it up in [Norvig's article](http://norvig.com/spell-correct.html). I am just going to explain what I like and I don't like in my Haskell version, adding type annotations previously omitted.


<br>

Let's start off with reading the file and training the probability model. Nothing special here. Just some mapping and filtering to create the Map of known words, our probability model.

```haskell
nWords :: Num a => IO (M.Map [Char] a)
nWords = B.readFile "big.txt" >>= \ws -> return (train (lowerWords (B.unpack ws)))

lowerWords :: String -> [String]
lowerWords = filter (not . null) . map (map toLower . filter (isAlpha )) . words

train :: (Ord k, Num a) => [k] -> M.Map k a
train = foldr (\ x acc -> M.insertWith (+) x 1 acc) M.empty
```

<br>

Things start getting interesting creating all the possible edits at distance 1.  
Haskell's list comprehensions are just amazing. Look for example at the `inserts` function: instead of 2 horrible for loops you can just read "combine all the splits for each letter of the alphabet". This is where Haskell really shines.

```haskell
edits1 :: String -> S.Set String
edits1 w = S.fromList $ deletes w ++ transposes w ++ replaces w ++ inserts w
  where splits :: [a] -> [([a], [a])]
        splits s = [ splitAt n s | n <- [0..((length s) - 1)] ]
	    deletes :: [a] -> [[a]]
        deletes = (map (\(a, b) -> a ++ (tail b))) . splits
		transposes :: [a] -> [[a]]
        transposes w = [ a ++ [b !! 1] ++ [b !! 0] ++ (drop 2 b) | (a,b) <- splits w , length b > 1 ]
		replaces :: String -> [String]
        replaces w = [a ++ [c] ++ (tail b) | (a,b) <- splits w , c <- alphabet]
		inserts :: String -> [String]
        inserts w = [a ++ [c] ++ b | (a,b) <- splits w , c <- alphabet]
```

<br>

Creating all the edits at distance 2 is trivial applying `edits1` twice with `map` and then reducing the sets using `foldr`. Classic map-reduce right here.
Creating the sets of known edits at distance 2 and the set of known words is just set interesection.

```haskell
edits2 :: String -> S.Set String
edits2 w = S.foldr (S.union) S.empty (S.map edits1 (edits1 w))

knownEdits2 :: String -> M.Map String a -> S.Set String
knownEdits2 w nwords = (edits2 w) `S.intersection` (M.keysSet nwords)

known :: Ord a => S.Set a -> M.Map a b -> S.Set a
known inputSet nwords = inputSet `S.intersection` (M.keysSet nwords)
```

<br>

Now the ugliest part.
I couldn't find nothing as neat as Python's `or` operator so I had to create a little function to do that for me. That's not too bad.
What I don't really like is the function `chooseBest`. Having to jump between sets and maps passing from lists is horrible. Probably even more terrible is having to manually sort the map based on the values.  
I am sure there is a better way since Haskell is so powerful, I just couldn't come up with it.

```haskell
choices :: String -> M.Map String a -> S.Set String
choices w ws = (known (S.singleton w) ws) `orNextIfEmpty` (known (edits1 w) ws)  `orNextIfEmpty` (knownEdits2 w ws) `orNextIfEmpty` (S.singleton w)
  where orNextIfEmpty x y = if S.null x then y else x

chooseBest :: (Ord b, Ord a) => S.Set a -> M.Map a b -> a
chooseBest ch ws = chooseBest' (ws `M.intersection` (M.fromList (map (\x -> (x,0)) (S.toList ch))))
  where chooseBest' bestChs = head $ (map fst (sortCandidates bestChs))
        sortCandidates = (sortBy (\(_,c1)(_,c2) -> c2 `compare` c1)) . M.toList
```

<br>

Finally the `correct` function glues everything together:

```haskell
correct :: String -> IO String
correct w = nWords >>= \ws -> return (chooseBest (choices w ws) ws)
```

<br>

Trying it out:

```bash
λ> correct "sometihng"    # distance 1
"something"
λ> correct "soomehting"   # distance 2
"something"
```

<br>

I am sure I have done something completely wrong and there's something that could have been done in a better way. Feedback is really appreciated. The code is on [GitHub](https://github.com/MarcoSero/Norvigs-Spelling-Corrector).

#### UPDATE ####

A lot of people pointed out that this code is not readable and it goes against a lot of Haskell best practices. I know that, in fact writing the most elegant Haskell code wasn't my objective for this article. I just wanted to come up with the shortest implementation.

Some [very](https://github.com/MarcoSero/Norvigs-Spelling-Corrector/pull/2) [kind](https://github.com/MarcoSero/Norvigs-Spelling-Corrector/pull/3) people helped me out on GitHub by making the code cleaner and neater (gotta :heart: open source) and now the final implementation looks something like this:

{% highlight haskell linenos %}
module Spelling (TrainingDict, nWords, correct) where

import Paths_Norvigs_Spelling_Corrector (getDataFileName)
import           Data.Char (toLower, isAlpha)
import           Data.List (sortBy, foldl')
import qualified Data.ByteString.Char8 as B
import qualified Data.Map.Strict as M
import qualified Data.Set as S
import           Data.Ord (comparing)

type WordSet = S.Set String
type TrainingDict = M.Map String Int

alphabet :: String
alphabet = ['a' .. 'z']

nWords :: IO TrainingDict
nWords = do
  ws <- getDataFileName "big.txt" >>= B.readFile
  return (train . lowerWords . B.unpack $ ws)

lowerWords :: String -> [String]
lowerWords = words . map normalize
  where normalize c = if isAlpha c then toLower c else ' '

train :: [String] -> TrainingDict
train = foldl' (\acc x -> M.insertWith (+) x 1 acc) M.empty

edits1 :: String -> WordSet
edits1 w = S.fromList $ deletes ++ transposes ++ replaces ++ inserts
  where
    splits = [ splitAt n w | n <- [0 .. length w - 1] ]
    deletes = map (\(a, b) -> a ++ tail b) splits
    transposes = [ a ++ [b !! 1] ++ [b !! 0] ++ drop 2 b
                 | (a,b) <- splits, length (take 2 b) > 1 ]
    replaces = [ a ++ [c] ++ tail b
               | (a,b) <- splits, c <- alphabet]
    inserts = [ a ++ [c] ++ b
              | (a,b) <- splits, c <- alphabet]

edits2 :: String -> WordSet
edits2 = S.foldl' S.union S.empty . S.map edits1 . edits1

knownEdits2 :: String -> TrainingDict -> WordSet
knownEdits2 w nwords = edits2 w `S.intersection` M.keysSet nwords

known :: WordSet -> TrainingDict -> WordSet
known inputSet nwords = inputSet `S.intersection` M.keysSet nwords

choices :: String -> TrainingDict -> WordSet
choices w ws = foldr orNextIfEmpty (S.singleton w)
  [ known (S.singleton w) ws
  , known (edits1 w) ws
  , knownEdits2 w ws
  ]
  where orNextIfEmpty x y = if S.null x then y else x

chooseBest :: WordSet -> TrainingDict -> String
chooseBest ch ws = chooseBest' $
  ws `M.intersection` M.fromList (map (\x -> (x, ())) (S.toList ch))
  where
    chooseBest' bestChs = head (map fst (sortCandidates bestChs))
    sortCandidates = sortBy (comparing snd) . M.toList

correct :: TrainingDict -> String -> String
correct ws w = chooseBest (choices w ws) ws
{% endhighlight %}
